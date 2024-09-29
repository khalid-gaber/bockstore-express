import { Request, Response } from "express";
import mongoose from 'mongoose';
const express = require('express');
const router = express.Router();
const path = require('path');
const multer  = require('multer')
const Post = require('../models/Post')
const { authenticateToken, decodeTokenIfAny } = require('../middlewares/verifyTokens');
const { postAfterCommentChange } = require('../utility/functionUtilities');

router.get('/', decodeTokenIfAny, async (req: Request, res: Response) => {
    try {
        if(req.query.user === 'auth' && !req.decoded?.userId) {
            res.sendStatus(403)
        } else {
            let postsPerPage = Number(req.query.postsPerPage) || 20;
            let pageIndex = Number(req.query.pageIndex) || 1;
            const userId = req.decoded?.userId || '';
            let userObjectId;
            try {
                userObjectId = new mongoose.Types.ObjectId(userId);
            }catch(err) {
                userObjectId = '';
            }
            const post = await Post.aggregate([
                {
                    $match: (req.query.user==='auth') ?  { 
                        user: userObjectId
                    } : {}
                },
                { $sort: {createdAt: -1} },
                { $skip: (pageIndex-1)* postsPerPage},
                { $limit: postsPerPage },
                {
                    $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    },
                },
                {$unwind: '$user'},
                {
                    $project: {
                        image: 1,
                        content: 1,
                        createdAt: 1,
                        upatedAt: 1,
                        'user._id': 1,
                        'user.username': 1,
                        'user.avatar': 1,
                        commentsNumber: {$size: "$comments"},
                        likesNumber: {$size: "$likes"},
                        dislikesNumber: {$size: "$dislikes"},
                        isLiked: {
                            $in: [userObjectId, "$likes"]
                        },
                        isDisliked: {
                            $in: [userObjectId, "$dislikes"]
                        },
                    },
                },
            ])

            const totalPostsNumber = await Post.countDocuments();
            res.status(200).json({
                meta: {
                    totalPostsNumber,
                    pagesNumber: Math.ceil(totalPostsNumber/postsPerPage),
                    postsPerPage,
                    pageIndex,
                },
                data: post
            });
        }
    } catch(err: any) {
        res.status(400).json({message: err.message || 'sorry, something went wrong'})
    }
});

router.get('/:id', decodeTokenIfAny, async (req: Request, res: Response) => {
    try {
        const post = await postAfterCommentChange(req.params.id, req.decoded?.userId);
        res.status(200).json({ data: post });
    } catch(err: any) {
        res.status(400).json({message: err.message || 'sorry, something went wrong'})
    }
});


//setting multer for handling files uploading 
const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, 'dist/public/uploads/img')
      },    
    filename: function (req: any, file: any, cb: any) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({
    limits: {fileSize: 200000},
    fileFilter: (req: any, file: any, cb: any) => {
        const filetypes = /.jpeg|.png|.jfif|.svg/
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
      
        if (extname) {
            return cb(null, true);
          } else {
            cb('only images of type jpeg, png, svg are accepted');
          }
    },
    storage: storage
}).single('image');
////////////////////////////////////////


router.post('/', authenticateToken, (req: any, res: Response) => {
    
    //validating and handling file using multer before saving it to DB
    upload(req, res, async (err: any) => {
        if (err instanceof multer.MulterError) {
            res.status(400).json({message: err.message || 'please, make sure that your file is a valid image and its size not exeeding 2MB'})
        } else if (err) {
            res.status(400).json({message: err || 'please, make sure that your file is a valid image and its size not exeeding 2MB'})
        } else {
            //save post on DB if image is valid
            try {
                let image = null;
                if (req.file) {
                    image = `/uploads/img/${req.file.filename}`
                }        
                const post = await Post.create({
                    user: req.decoded?.userId,
                    image: image,
                    content: req.body.content
                })
                res.status(201).json({data: post});
            } catch(err: any) {
                console.log(`from error: ${err.message}` || 'sorry, post had not created successfully');
                res.status(400).json({message: err.message || 'sorry, post had not created successfully'})
            } 
        }
    })
});

module.exports =  router;