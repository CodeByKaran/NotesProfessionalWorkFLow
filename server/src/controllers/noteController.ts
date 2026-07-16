import { Request, Response } from "express";
import Note from "../models/Note.js";

// @desc    Get all notes (Paginated)
// @route   GET /api/notes
export const getNotes = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Parse pagination queries (default to page 1, 10 items per page)
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // 2. Fetch the specific chunk of data
        const notes = await Note.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // 3. Count total documents to determine if there is a next page
        const total = await Note.countDocuments();
        const hasNextPage = skip + notes.length < total;

        // 4. Return the data payload + pagination metadata
        res.status(200).json({
            notes,
            nextPage: hasNextPage ? page + 1 : null,
            totalNotes: total
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @decsc create Note
// @route POST /api/notes
export const createNote = async(req:Request,res:Response):Promise<void>=>{
    try {
        const {title,content,tags} = req.body;
    
   if(!title || !content){
    res.status(400).json({ message: "Title and Content are required" });
    return; // Don't forget to return so the function stops executing
}

    const note = await Note.create({title,content,tags});
    res.status(201).json(note);

    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

// @desc    Update a note
// @route   PUT /api/notes/:id
export const updateNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content, tags } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content, tags },
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        res.status(200).json({ message: 'Note successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};