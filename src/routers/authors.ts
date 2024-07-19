import { Request, Response } from "express";
const express = require('express');
const router = express.Router();
const Author = require('../models/Author')

type Author = {
    id: number,
    firstName: string,
    lastName: string,
    nat: string,
    image?: string,
}

router.get('/', async (req: Request, res: Response) => {
    try {
        const authors = await Author.find({});
        res.status(200).json(authors);    
    } catch(err: any) {
        console.log(err.message);
        res.status(404).json({message: err.message})
    }
})

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const author = await Author.find({_id: `${req.params.id}`}, {firstName: 1, lastName: 1, nat: 1, image: 1})
        if(!author){
            throw new Error('this author not found');
        }
        res.status(200).json(author);
    } catch (err: any) {
        console.log(err.message);
        res.status(404).json({message: err.message})
    }
})

router.post('/', async (req: Request, res: Response)=>{
    try {
        let author = await Author.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nat: req.body.nat,
            image: req.body.image
        });
        res.json({
            data: author,
            message: 'the new author created successfully'
        });
    } catch(err: any) {
        console.log(err);
        res.status(404).json({message: err.message})
    }
})

router.put('/:id', async (req: Request, res: Response)=>{
    try {
        const author = await Author.updateOne({_id: `${req.params.id}`}, {$set: req.body});
        console.log(author);
        res.status(201).json({ message: 'updated successfully' });
    } catch(err: any) {
        console.log(err.message);
        res.status(404).json({message: err.message})
    }
})

router.delete('/:id', async (req: Request, res: Response)=>{
    try {
        const author = await Author.deleteOne({_id: `${req.params.id}`});
        console.log(author);
        res.status(201).json({ message: 'deleted successfully' });
    } catch(err: any) {
        console.log(err.message);
        res.status(404).json({message: err.message})
    }
})

module.exports =  router;


