"use client"

import axios from "axios";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faPenToSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

interface Note {
    id: number;
    title: string;
    note: string;
}

const Home: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
    const [formErrors, setFormErrors] = useState({
        title: '',
        content: ''
    });

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/get');
            const data = await res.json();
            setNotes(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            throw new Error("Failed to get data from MongoDB");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let errorMessage = '';
        if (name === 'title' && !value.trim()) {
            errorMessage = 'Title is required';
        } else if (name === 'content' && !value.trim()) {
            errorMessage = 'Content is required';
        }
        setFormData(prevState => ({ ...prevState, [name]: value }));
        setFormErrors(prevErrors => ({ ...prevErrors, [name]: errorMessage }));
    };

    const handleAdd = async () => {
        try {
            if (!formData.title.trim() || !formData.content.trim()) {
                setFormErrors({
                    title: !formData.title.trim() ? 'Title is required' : '',
                    content: !formData.content.trim() ? 'Content is required' : ''
                });
                return;
            }
            await axios.post('http://localhost:3000/api/add', {
                title: formData.title,
                note: formData.content
            });
            window.alert('Note added successfully');
            setFormData({ title: '', content: '' });
            fetchNotes();
        } catch (error) {
            console.error('Error adding note:', error);
            window.alert('Failed to add note');
        }
    };

    const handleDelete = async (index: number) => {
        const shouldDelete = window.confirm("Are you sure you want to delete this note?");
        if (shouldDelete) {
            try {
                await axios.delete(`http://localhost:3000/api/delete/${notes[index].id}`);
                fetchNotes();
            } catch (error) {
                console.error('Error deleting note:', error);
                window.alert('Failed to delete note');
            }
        }
    };

    const handleEdit = (index: number) => {
        setFormData({
            title: notes[index].title,
            content: notes[index].note
        });
        setSelectedRowIndex(index);
    };

    const handleUpdate = async () => {
        try {
            if (selectedRowIndex !== null) {
                await axios.put(`http://localhost:3000/api/update/${notes[selectedRowIndex].id}`, {
                    title: formData.title,
                    note: formData.content
                });
                window.alert('Note updated successfully');
                setSelectedRowIndex(null);
                fetchNotes();
                setFormData({ title: '', content: '' });
            }
        } catch (error) {
            console.error('Error updating note:', error);
            window.alert('Failed to update note');
        }
    };


    
    return (
        <div className="mx-auto flex items-center  flex-col h-screen py-5  overflow-auto">
            <h1 className="mb-4  text-mycolor text-4xl  font-extrabold leading-none tracking-tight  " >Your Notes</h1>
            <div className="flex  flex-col lg:w-1/2 md:w-full md:px-10 phone:px-10 justify-between items-center ">
                <input
                    className='mb-2 block p-2.5 w-full phone:w-3/4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    type="text"
                    placeholder="Enter Title"
                    name="title"
                    onChange={handleChange}
                    value={formData.title}
                    required
                />
                {formErrors.title && <div className="text-red-500 text-xs">{formErrors.title}</div>}
                <textarea
                    name="content"
                    rows={5}
                    className="block p-2.5 w-full text-sm phone:w-3/4 text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your notes here..."
                    onChange={handleChange}
                    value={formData.content}
                    required
                />
                {formErrors.content && <div className="text-red-500 text-xs">{formErrors.content}</div>}
                {
                    selectedRowIndex === null ? (
                        <div className='mt-3 bg-mycolor h-10 w-10 rounded-full flex items-center justify-center font-semibold text-white hover:bg-white text-xl hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer' onClick={handleAdd}>
                            <p><FontAwesomeIcon icon={faPlus} /></p>
                        </div>
                    ) : (
                        <div className='mt-3 bg-mycolor h-10 w-10 rounded-full flex items-center justify-center font-semibold text-white hover:bg-white text-xl hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer' onClick={handleUpdate}>
                            <p><FontAwesomeIcon icon={faCheckSquare} /></p>
                        </div>
                    )
                }
                <div className="overflow-x-auto">
                    <table className="mt-20 min-w-full table-auto">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-2">
                                    No
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Title
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Note
                                </th>
                                <th scope="col" className="px-4 py-2">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {notes.map((note:any, index:number) => (
                                <tr className="text-sm" key={index}>
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{note.title}</td>
                                    <td className="border px-4 py-2">{note.note}</td>
                                    <td className="border65f6a0cc0c2c893234b262e0 px-4 py-2">
                                        <div className="flex items-center justify-center">
                                            {selectedRowIndex === index ? (
                                                <button className="bg-mycolor h-8 w-8 rounded-full flex items-center justify-center font-semibold text-white ml-2 hover:bg-white hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer" onClick={() => handleUpdate()}>
                                                    <FontAwesomeIcon icon={faCheckSquare} />
                                                </button>
                                            ) : (
                                                <>
                                                    <button className="bg-mycolor h-8 w-8 rounded-full flex items-center justify-center font-semibold text-white ml-2 hover:bg-white hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer" onClick={() => handleDelete(index)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                    <button className="bg-mycolor h-8 w-8 rounded-full flex items-center justify-center font-semibold text-white ml-2 hover:bg-white hover:text-mycolor hover:border-2 hover:border-mycolor hover:cursor-pointer" onClick={() => handleEdit(index)}>
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
                                            }
 export default Home;