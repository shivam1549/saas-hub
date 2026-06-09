import React, { useState, useEffect, useRef } from 'react'; // 🔥 Import useRef
import { X, MessageSquare, Paperclip, Clock, AlignLeft, User, FileText } from 'lucide-react'; // 🔥 Import FileText
import api from '@/api/axios';

export default function TaskPanel({ task, isOpen, onClose, users = [] }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🔥 NEW: State and Ref for File Upload
    const [attachment, setAttachment] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen && task) {
            const fetchComments = async () => {
                try {
                    const res = await api.get(`/tasks/${task.id}/comments`);
                    setComments(res.data);
                } catch (error) {
                    console.error("Failed to load comments", error);
                }
            };
            fetchComments();
        }
    }, [isOpen, task]);

    if (!isOpen || !task) return null;
    const assignedUser = users.find(u => String(u.id) === String(task.assignee_id));

    // 🔥 UPGRADED: Send FormData instead of JSON
    const handleSendComment = async () => {
        if (!newComment.trim() && !attachment) return; // Prevent empty sends
        setIsSubmitting(true);

        // 1. Build the form payload
        const formData = new FormData();
        if (newComment.trim()) formData.append('content', newComment);
        if (attachment) formData.append('attachment', attachment);

        try {
            // 2. Axios automatically sets the correct multipart headers when passing FormData!
            const res = await api.post(`/tasks/${task.id}/comments`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setComments([res.data, ...comments]);
            setNewComment("");
            setAttachment(null); // Clear the file after sending
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={onClose} />
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col transition-transform duration-300">

                {/* ... KEEP YOUR EXISTING HEADER AND META DATA HTML HERE ... */}

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Title & Meta Data ... */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">{task.title}</h2>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-600">
                            {task.description || <span className="italic text-slate-400">No description provided.</span>}
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                            <MessageSquare size={16} className="text-slate-400" /> Activity & Comments
                        </div>

                        {/* 🔥 UPGRADED COMMENT INPUT */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm focus-within:border-blue-400 focus-within:ring-1 transition-all">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment or attach a file..."
                                className="w-full text-sm outline-none resize-none bg-transparent placeholder-slate-400 text-slate-700"
                                rows="2"
                                disabled={isSubmitting}
                            ></textarea>

                            {/* SHOW SELECTED FILE PREVIEW */}
                            {attachment && (
                                <div className="flex items-center justify-between bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg mt-2 mb-1">
                                    <div className="flex items-center gap-2 truncate">
                                        <FileText size={14} />
                                        <span className="truncate max-w-[200px] font-medium">{attachment.name}</span>
                                    </div>
                                    <button onClick={() => setAttachment(null)} className="hover:text-blue-900 font-bold ml-2">X</button>
                                </div>
                            )}

                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-50">

                                {/* HIDDEN FILE INPUT & PAPERCLIP BUTTON */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => setAttachment(e.target.files[0])}
                                />
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-slate-50"
                                    title="Attach File"
                                >
                                    <Paperclip size={16} />
                                </button>

                                <button
                                    onClick={handleSendComment}
                                    disabled={isSubmitting || (!newComment.trim() && !attachment)}
                                    className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </div>

                        {/* 🔥 UPGRADED FEED (SHOWS ATTACHMENTS) */}
                        <div className="mt-6 space-y-4">
                            {comments.length === 0 ? (
                                <p className="text-center text-sm text-slate-400 italic py-4">No comments yet. Start the conversation!</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                            {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-slate-800">{comment.user?.name || 'Unknown User'}</span>
                                                <span className="text-[10px] text-slate-400">{formatDate(comment.created_at)}</span>
                                            </div>

                                            {/* Text Content */}
                                            {comment.content && (
                                                <p className="text-sm text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-xl rounded-tl-none whitespace-pre-wrap mb-1">
                                                    {comment.content}
                                                </p>
                                            )}

                                            {/* Attached File Link */}
                                            {comment.file_path && (
                                                <a
                                                    // Laravel storage path URL
                                                    href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${comment.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl hover:bg-blue-100 hover:border-blue-200 transition-all max-w-full"
                                                >
                                                    <FileText size={14} className="shrink-0" />
                                                    <span className="truncate">{comment.file_name}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}