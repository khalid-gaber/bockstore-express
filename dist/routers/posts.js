"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Post = require('../models/Post');
const { authenticateToken, decodeTokenIfAny } = require('../middlewares/verifyTokens');
const { postAfterCommentChange } = require('../utility/functionUtilities');
router.get('/', decodeTokenIfAny, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (req.query.user === 'auth' && !((_a = req.decoded) === null || _a === void 0 ? void 0 : _a.userId)) {
            res.sendStatus(403);
        }
        else {
            let postsPerPage = Number(req.query.postsPerPage) || 20;
            let pageIndex = Number(req.query.pageIndex) || 1;
            const userId = ((_b = req.decoded) === null || _b === void 0 ? void 0 : _b.userId) || '';
            let userObjectId;
            try {
                userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            }
            catch (err) {
                userObjectId = '';
            }
            const post = yield Post.aggregate([
                {
                    $match: (req.query.user === 'auth') ? {
                        user: userObjectId
                    } : {}
                },
                { $sort: { createdAt: -1 } },
                { $skip: (pageIndex - 1) * postsPerPage },
                { $limit: postsPerPage },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                { $unwind: '$user' },
                {
                    $project: {
                        image: 1,
                        content: 1,
                        createdAt: 1,
                        upatedAt: 1,
                        'user._id': 1,
                        'user.username': 1,
                        'user.avatar': 1,
                        commentsNumber: { $size: "$comments" },
                        likesNumber: { $size: "$likes" },
                        dislikesNumber: { $size: "$dislikes" },
                        isLiked: {
                            $in: [userObjectId, "$likes"]
                        },
                        isDisliked: {
                            $in: [userObjectId, "$dislikes"]
                        },
                    },
                },
            ]);
            const totalPostsNumber = yield Post.countDocuments();
            res.status(200).json({
                meta: {
                    totalPostsNumber,
                    pagesNumber: Math.ceil(totalPostsNumber / postsPerPage),
                    postsPerPage,
                    pageIndex,
                },
                data: post
            });
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message || 'sorry, something went wrong' });
    }
}));
router.get('/:id', decodeTokenIfAny, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const post = yield postAfterCommentChange(req.params.id, (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.userId);
        res.status(200).json({ data: post });
    }
    catch (err) {
        res.status(400).json({ message: err.message || 'sorry, something went wrong' });
    }
}));
//setting multer for handling files uploading 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'dist/public/uploads/img');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    limits: { fileSize: 200000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /.jpeg|.png|.jfif|.svg/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        else {
            cb('only images of type jpeg, png, svg are accepted');
        }
    },
    storage: storage
}).single('image');
////////////////////////////////////////
router.post('/', authenticateToken, (req, res) => {
    //validating and handling file using multer before saving it to DB
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (err instanceof multer.MulterError) {
            res.status(400).json({ message: err.message || 'please, make sure that your file is a valid image and its size not exeeding 2MB' });
        }
        else if (err) {
            res.status(400).json({ message: err || 'please, make sure that your file is a valid image and its size not exeeding 2MB' });
        }
        else {
            //save post on DB if image is valid
            try {
                let image = null;
                if (req.file) {
                    image = `/uploads/img/${req.file.filename}`;
                }
                const post = yield Post.create({
                    user: (_a = req.decoded) === null || _a === void 0 ? void 0 : _a.userId,
                    image: image,
                    content: req.body.content
                });
                res.status(201).json({ data: post });
            }
            catch (err) {
                console.log(`from error: ${err.message}` || 'sorry, post had not created successfully');
                res.status(400).json({ message: err.message || 'sorry, post had not created successfully' });
            }
        }
    }));
});
module.exports = router;
