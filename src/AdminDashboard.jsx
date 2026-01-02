import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
// 👇 Storage imports அகற்றப்பட்டது
import { db } from './firebaseConfig.js'; 
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Icon and Toggle Button Components ---
const SunIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const MenuIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const ThemeToggleButton = ({ theme, setTheme }) => ( <AnimatePresence mode="wait" initial={false}><motion.button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-yellow-400 bg-slate-200 dark:bg-slate-700 transition-colors" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} key={theme} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.2 }}>{theme === 'light' ? <MoonIcon /> : <SunIcon />}</motion.button></AnimatePresence>);

// ⚙️ Main Admin Dashboard
const AdminDashboard = ({ theme, setTheme }) => {
    
    const UpsertModal = ({ isOpen, onClose, currentView, onSave, editingItem }) => {
        const [formData, setFormData] = useState({});
        const [isUploading, setIsUploading] = useState(false);

        useEffect(() => { if (isOpen) setFormData(editingItem || {}); }, [editingItem, isOpen]);
        const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
        const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
        
        if (!isOpen) return null;

        // 👇 NEW: Helper function to convert file to Base64 String
        const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = () => { resolve(fileReader.result); };
                fileReader.onerror = (error) => { reject(error); };
            });
        };

        // 👇 Modified: Handle Image without Firebase Storage
        const handleImageUpload = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // ⚠️ Check File Size (Firestore limit is 1MB per document)
            if (file.size > 800000) { // Approx 800KB limit to be safe
                alert("File is too large! Please upload an image smaller than 800KB.");
                return;
            }

            setIsUploading(true);
            try {
                const base64 = await convertToBase64(file);
                // Directly set the base64 string as the imageUrl
                setFormData(prev => ({ ...prev, imageUrl: base64 }));
            } catch (error) {
                console.error("Conversion failed", error);
                alert("Failed to process image.");
            }
            setIsUploading(false);
        };

        const getFormFields = () => {
            switch (currentView) {
                case 'blogs': return (
                    <> 
                        <InputField name="title" label="Blog Title" value={formData.title || ''} onChange={handleInputChange} /> 
                        
                        {/* 👇 Use explicit value for default if empty */}
                        <SelectField name="category" label="Category" value={formData.category || 'Industry Insights'} onChange={handleInputChange}> 
                            <option value="Case Studies">Case Studies</option> 
                            <option value="Use Case">Use Case</option> 
                            <option value="Company News">Company News</option> 
                            <option value="Industry Insights">Industry Insights</option> 
                        </SelectField> 
                        
                        <InputField name="author" label="Author" value={formData.author || ''} onChange={handleInputChange} /> 
                        
                        <div className="py-2 border-t border-b border-slate-200 dark:border-slate-700 my-2">
                             {/* Standard URL Input */}
                            <InputField name="imageUrl" label="Image URL (Paste Link or Upload below)" value={formData.imageUrl || ''} onChange={handleInputChange} placeholder="https://..." />
                            
                            <div className="mt-2">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Or Upload Image (Max 800KB)</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-700 dark:file:text-slate-200"
                                />
                                {isUploading && <span className="text-sm text-blue-500 animate-pulse">Processing Image...</span>}
                            </div>
                            
                            {/* Preview */}
                            {formData.imageUrl && (
                                <div className="mt-2">
                                    <p className="text-xs text-slate-500">Preview:</p>
                                    <img src={formData.imageUrl} alt="Preview" className="mt-1 h-24 w-auto rounded border border-slate-300" />
                                </div>
                            )}
                        </div>

                        <TextareaField name="description" label="Description" value={formData.description || ''} onChange={handleInputChange} /> 
                    </>
                );

                case 'services': return (<> <InputField name="title" label="Service Name" value={formData.title || ''} onChange={handleInputChange} /> <InputField name="iconUrl" label="Icon URL (PNG)" placeholder="e.g., /images/icons/student.png" value={formData.iconUrl || ''} onChange={handleInputChange} /> <TextareaField name="description" label="Description" value={formData.description || ''} onChange={handleInputChange} /> </>);
                
                case 'ourwork': return (
                    <> 
                        <InputField name="title" label="Domain / Industry Title" value={formData.title || ''} onChange={handleInputChange} /> 
                        
                         <div className="py-2 border-t border-b border-slate-200 dark:border-slate-700 my-2">
                            <InputField name="imageUrl" label="Image URL (Paste Link or Upload below)" value={formData.imageUrl || ''} onChange={handleInputChange} placeholder="https://..." />
                            
                            <div className="mt-2">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Or Upload Image (Max 800KB)</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-700 dark:file:text-slate-200"
                                />
                                {isUploading && <span className="text-sm text-blue-500 animate-pulse">Processing Image...</span>}
                            </div>
                             {formData.imageUrl && (
                                <div className="mt-2">
                                    <img src={formData.imageUrl} alt="Preview" className="mt-1 h-24 w-auto rounded border border-slate-300" />
                                </div>
                            )}
                        </div>

                        <TextareaField name="description" label="Description" value={formData.description || ''} onChange={handleInputChange} /> 
                    </>
                );

                case 'careers': return (<> <InputField name="name" label="Full Name" value={formData.name || ''} onChange={handleInputChange} /> <InputField name="email" label="Email Address" type="email" value={formData.email || ''} onChange={handleInputChange} /> <SelectField name="role" label="Applying for Role" value={formData.role || 'Frontend Developer'} onChange={handleInputChange}> <option>Frontend Developer</option> <option>Backend Developer</option> <option>AI/ML Engineer</option> <option>Business Analyst</option> </SelectField> </>);
                case 'contact': return (<> <InputField name="companyName" label="Company Name" value={formData.companyName || ''} onChange={handleInputChange} /> <InputField name="email" label="Email" type="email" value={formData.email || ''} onChange={handleInputChange} /> <TextareaField name="message" label="Project Details / Message" value={formData.message || ''} onChange={handleInputChange} /> </>);
                case 'testimonials': return ( <> <InputField name="name" label="Client Name" value={formData.name || ''} onChange={handleInputChange} /> <InputField name="companyName" label="Company Name" value={formData.companyName || ''} onChange={handleInputChange} /> <InputField name="jobTitle" label="Job Title" value={formData.jobTitle || ''} onChange={handleInputChange} /> <InputField type="number" name="rating" label="Rating (1-5)" value={formData.rating || ''} onChange={handleInputChange} min="1" max="5" /> <TextareaField name="testimonialText" label="Testimonial Text" value={formData.testimonialText || ''} onChange={handleInputChange} /> <SelectField name="status" label="Status" value={formData.status || 'pending'} onChange={handleInputChange}> <option value="pending">Pending</option> <option value="approved">Approved</option> </SelectField> </> );
                default: return <p>No form configured for this section.</p>;
            }
        };
        return ( 
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"> 
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700"> 
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700"> 
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingItem ? 'Edit' : 'Add New'} {currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h3> 
                    </div> 
                    <form onSubmit={handleSubmit}> 
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">{getFormFields()}</div> 
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-4 border-t border-slate-200 dark:border-slate-700"> 
                            <button type="button" onClick={onClose} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-2 px-4 rounded transition-colors">Cancel</button> 
                            {/* Disable Save while uploading */}
                            <button type="submit" disabled={isUploading} className={`font-bold py-2 px-4 rounded transition-colors ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white`}>
                                {isUploading ? 'Processing...' : 'Save'}
                            </button> 
                        </div> 
                    </form> 
                </div> 
            </div> 
        );
    };

    const InputField = ({ name, label, ...props }) => (<div className='py-1'><label htmlFor={name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label><input id={name} name={name} {...props} className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white p-2 rounded border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" /></div>);
    const TextareaField = ({ name, label, ...props }) => (<div className='py-1'><label htmlFor={name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label><textarea id={name} name={name} {...props} rows="4" className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white p-2 rounded border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"></textarea></div>);
    const SelectField = ({ name, label, children, ...props }) => (<div className='py-1'><label htmlFor={name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label><select id={name} name={name} {...props} className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white p-2 rounded border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors">{children}</select></div>);

    const [currentView, setCurrentView] = useState('blogs');
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        setLoading(true);
        const collectionMap = {
            ourwork: 'works',
            contact: 'contactRequests',
            careers: 'careerApplications'
        };
        const collectionName = collectionMap[currentView] || currentView;

        const collectionRef = collection(db, collectionName);
        const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
            const docsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDocuments(docsData);
            setLoading(false);
        }, (error) => {
            console.error(`Error fetching ${collectionName}:`, error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentView]);

    const handleSignOut = async () => { try { await signOut(auth); navigate('/login'); } catch (err) { console.error('Failed to log out:', err); } };
    const openAddModel = () => { setEditingItem(null); setIsModalOpen(true); };
    const openEditModel = (item) => { setEditingItem(item); setIsModalOpen(true); };

    const handleSave = async (formData) => {
        const collectionMap = { ourwork: 'works', contact: 'contactRequests', careers: 'careerApplications' };
        const collectionName = collectionMap[currentView] || currentView;
        try {
            if (editingItem) {
                await updateDoc(doc(db, collectionName, editingItem.id), formData);
            } else {
                const dataToSave = currentView === 'testimonials' 
                    ? { ...formData, status: formData.status || 'pending', submittedAt: serverTimestamp() } 
                    : { ...formData, submittedAt: serverTimestamp() };
                await addDoc(collection(db, collectionName), dataToSave);
            }
            setIsModalOpen(false); setEditingItem(null);
        } catch (error) { console.error('Error saving document: ', error); alert('Failed to save item.'); }
    };
    
    const handleToggleStatus = async (item) => {
        const newStatus = item.status === 'approved' ? 'pending' : 'approved';
        try {
            await updateDoc(doc(db, 'testimonials', item.id), { status: newStatus });
        } catch (error) {
            console.error('Error updating status: ', error);
            alert('Failed to update status.');
        }
    };

    const handleDelete = async (id) => {
        const collectionMap = { ourwork: 'works', contact: 'contactRequests', careers: 'careerApplications' };
        const collectionName = collectionMap[currentView] || currentView;
        if (window.confirm(`Are you sure you want to delete this item?`)) {
            try { await deleteDoc(doc(db, collectionName, id)); }
            catch (error) { console.error('Error removing document: ', error); }
        }
    };
    
    const navItems = ['blogs', 'services', 'ourwork', 'careers', 'contact', 'testimonials'];

    const renderItemCard = (doc) => {
        let title, detail;
        switch (currentView) {
            case 'careers': title = doc.name; detail = doc.role; break;
            case 'contact': title = doc.companyName; detail = doc.email; break;
            case 'testimonials':
                title = doc.name;
                detail = (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${doc.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                            {doc.status}
                        </span>
                        <span>{`⭐ ${doc.rating} | ${doc.companyName}`}</span>
                    </div>
                );
                break;
            default: title = doc.title || 'No Title'; detail = doc.category || doc.author || 'N/A';
        }

        return (
            <div key={doc.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{currentView === 'testimonials' ? 'Client Name' : (currentView === 'careers' || currentView === 'contact' ? 'Name/Company' : 'Title')}</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 break-words">{title}</p>
                    </div>
                    <div className="flex-shrink-0 flex gap-2 pt-2">
                        <button onClick={() => openEditModel(doc)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors">Edit</button>
                        <button onClick={() => handleDelete(doc.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors">Delete</button>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Detail / Category</p>
                    <div className="text-slate-600 dark:text-slate-300 break-words">{detail}</div>
                    {currentView === 'testimonials' && (
                        <button onClick={() => handleToggleStatus(doc)} className={`mt-3 w-full font-bold py-2 px-4 rounded transition-colors ${doc.status === 'approved' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}>
                            {doc.status === 'approved' ? 'Unapprove' : 'Approve'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex transition-colors relative">
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 p-6 flex flex-col justify-between border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
                <div>
                    <h1 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">Admin Panel</h1>
                    <nav>
                        <ul>
                            {navItems.map(item => (
                                <li key={item} className="mb-2">
                                    <button onClick={() => { setCurrentView(item); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-2 rounded transition-colors duration-200 font-semibold ${currentView === item ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                        Manage {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <button onClick={handleSignOut} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">Sign Out</button>
            </aside>
            {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
            <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button className="text-slate-800 dark:text-white lg:hidden" onClick={() => setIsSidebarOpen(true)}> <MenuIcon /> </button>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Manage {currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <ThemeToggleButton theme={theme} setTheme={setTheme} />
                        <button onClick={openAddModel} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 sm:px-4 rounded flex items-center gap-2 text-sm sm:text-base"> <span className="hidden sm:inline">+</span> Add New </button>
                    </div>
                </div>
                <div className="hidden lg:block bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-x-auto border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="p-4 w-2/5 font-semibold text-slate-600 dark:text-slate-300">Title / Name</th>
                                <th className="p-4 w-2/5 font-semibold text-slate-600 dark:text-slate-300">Detail / Category</th>
                                <th className="p-4 w-1/5 text-right font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3" className="text-center p-8 text-slate-500 dark:text-slate-400">Loading...</td></tr>
                            ) : documents.length > 0 ? (
                                documents.map((doc) => {
                                    let title, detail;
                                    switch (currentView) {
                                        case 'careers': title = doc.name; detail = doc.role; break;
                                        case 'contact': title = doc.companyName; detail = doc.email; break;
                                        case 'testimonials':
                                            title = doc.name;
                                            detail = (
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${doc.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                                                        {doc.status}
                                                    </span>
                                                    <span>{`⭐ ${doc.rating} | ${doc.companyName}`}</span>
                                                </div>
                                            );
                                            break;
                                        default: title = doc.title || 'No Title'; detail = doc.category || doc.author || 'N/A';
                                    }
                                    return (
                                        <tr key={doc.id} className="border-b border-slate-200 dark:border-slate-700">
                                            <td className="p-4 font-medium text-slate-700 dark:text-slate-200 truncate">{title}</td>
                                            <td className="p-4 text-slate-500 dark:text-slate-400 truncate">{detail}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    {currentView === 'testimonials' && (
                                                        <button onClick={() => handleToggleStatus(doc)} className={`font-bold py-2 px-4 rounded transition-colors ${doc.status === 'approved' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}>
                                                            {doc.status === 'approved' ? 'Unapprove' : 'Approve'}
                                                        </button>
                                                    )}
                                                    <button onClick={() => openEditModel(doc)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">Edit</button>
                                                    <button onClick={() => handleDelete(doc.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="3" className="text-center p-8 text-slate-500">No documents found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="lg:hidden">
                    {loading ? ( <p className="text-center p-8 text-slate-500 dark:text-slate-400">Loading...</p> ) : documents.length > 0 ? ( documents.map(renderItemCard) ) : ( <p className="text-center p-8 text-slate-500">No documents found.</p> )}
                </div>
            </main>
            <UpsertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} currentView={currentView} onSave={handleSave} editingItem={editingItem} />
        </div>
    );
};

export default AdminDashboard;