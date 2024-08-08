import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Quote from '@editorjs/quote';
import List from '@editorjs/list';
import Delimiter from '@editorjs/delimiter';
import { SimpleImage } from './editor'; // Your SimpleImage plugin

const App = () => {
    const editorRef = useRef(null);
    const outputRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [formData, setFormData] = useState({
        publisher: '',
        publisherImage: null,
        date: '',
        isVerified: false,
        category: '',
        preferredSection: '',
        title: '',
        thumbnail: null
    });
    const [savedData, setSavedData] = useState(null);
    const [errors, setErrors] = useState({});

    const handleAddCategory = () => {
        if (newCategory.trim() !== '') {
            setCategories([...categories, newCategory]);
            setNewCategory('');
        }
    };

    const handleInputChange = (e) => {
        const { id, value, type, checked, files, name } = e.target;
        setFormData({
            ...formData,
            [type === 'radio' ? name : id]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        });
        setErrors({
            ...errors,
            [type === 'radio' ? name : id]: ''
        });
    };

    useEffect(() => {
        if (!editorRef.current) {
            editorRef.current = new EditorJS({
                autofocus: true,
                holder: 'editorjs',
                tools: {
                    header: {
                        class: Header,
                        inlineToolbar: true,
                        config: {
                            placeholder: 'Enter a Heading',
                            levels: [1, 2, 3, 4, 5, 6]
                        },
                        shortcut: 'CMD+SHIFT+H'
                    },
                    image: {
                        class: SimpleImage,
                        inlineToolbar: true,
                    },
                    quote: {
                        class: Quote,
                        inlineToolbar: true,
                        config: {
                            quotePlaceholder: 'Enter a quote',
                            captionPlaceholder: 'Quote\'s author',
                        },
                        shortcut: 'CMD+SHIFT+O'
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                        shortcut: 'CMD+SHIFT+L'
                    },
                    delimiter: Delimiter,
                },
                data: {
                    time: 1552744582955,
                    blocks: [
                        {
                            type: "header",
                            data: {
                                text: "",
                                level: 2
                            }
                        },
                    ],
                    version: "2.11.10"
                }
            });
        }
    }, []);

    const handleSave = () => {
        const newErrors = {};
        if (!formData.publisher) newErrors.publisher = 'Publisher is required';
        if (!formData.publisherImage) newErrors.publisherImage = 'Publisher image is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.title) newErrors.title = 'Title is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (editorRef.current) {
            editorRef.current.save().then((editorData) => {
                setSavedData({
                    ...formData,
                    content: editorData
                });
                outputRef.current.innerHTML = JSON.stringify({
                    ...formData,
                    content: editorData
                }, null, 4);
            }).catch(error => {
                console.error("Saving failed: ", error);
            });
        } else {
            console.error("Editor reference is null.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Blog:</h1>
            <div className="mb-4">
                <h2 className="text-xl mb-2">Who publish it:</h2>
                <input
                    type="text"
                    id="publisher"
                    className="border p-2 mb-2 block w-full"
                    value={formData.publisher}
                    onChange={handleInputChange}
                />
                {errors.publisher && <p className="text-red-500">{errors.publisher}</p>}
                <input
                    type="file"
                    id="publisherImage"
                    className="border p-2"
                    onChange={handleInputChange}
                />
                {errors.publisherImage && <p className="text-red-500">{errors.publisherImage}</p>}
            </div>
            <div className="mb-4">
                <h2 className="text-xl mb-2">When publish it:</h2>
                <input
                    type="date"
                    id="date"
                    className="border p-2 block w-full"
                    value={formData.date}
                    onChange={handleInputChange}
                />
                {errors.date && <p className="text-red-500">{errors.date}</p>}
            </div>
            <div className="mb-4">
                <h2 className="text-xl mb-2">Verification:</h2>
                <label htmlFor="verification" className="inline-block mr-2">Is Verified</label>
                <input
                    type="checkbox"
                    id="isVerified"
                    checked={formData.isVerified}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mb-4">
                <h2 className="text-xl mb-2">Category:</h2>
                <label htmlFor="category" className="inline-block mr-2">Category:</label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="border p-2 block w-full"
                />
                <button
                    onClick={handleAddCategory}
                    className="mt-2 bg-blue-500 text-white p-2 rounded"
                >
                    Add Category
                </button>
                <div className="mt-4">
                    <label htmlFor="categoryDropdown" className="inline-block mr-2">Select Category:</label>
                    <select
                        id="category"
                        name="category"
                        className="border p-2 block w-full"
                        value={formData.category}
                        onChange={handleInputChange}
                    >
                        <option value="">Select a category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-500">{errors.category}</p>}
                </div>
            </div>
            <div className="mb-4">
                <h2 className="text-xl mb-2">Preferred section:</h2>
                <div className="flex items-center mb-2">
                    <input
                        type="radio"
                        id="section1"
                        name="preferredSection"
                        value="section1"
                        className="mr-2"
                        checked={formData.preferredSection === 'section1'}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="section1">Section 1</label>
                </div>
                <div className="flex items-center mb-2">
                    <input
                        type="radio"
                        id="section2"
                        name="preferredSection"
                        value="section2"
                        className="mr-2"
                        checked={formData.preferredSection === 'section2'}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="section2">Section 2</label>
                </div>
                <div className="flex items-center mb-2">
                    <input
                        type="radio"
                        id="section3"
                        name="preferredSection"
                        value="section3"
                        className="mr-2"
                        checked={formData.preferredSection === 'section3'}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="section3">Section 3</label>
                </div>
                <div className="flex items-center">
                    <input
                        type="radio"
                        id="section4"
                        name="preferredSection"
                        value="section4"
                        className="mr-2"
                        checked={formData.preferredSection === 'section4'}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="section4">Section 4</label>
                </div>
            </div>
            <div className="mb-4">
                <h2 className="text-xl mb-2">Title:</h2>
                <input
                    type="text"
                    id="title"
                    className="border p-2 block w-full"
                    value={formData.title}
                    onChange={handleInputChange}
                />
                {errors.title && <p className="text-red-500">{errors.title}</p>}
            </div>
            <div>
                <h2 className="text-xl mb-2">Thumbnail:</h2>
                <input
                    type="file"
                    id="thumbnail"
                    className="border p-2"
                    onChange={handleInputChange}
                />
                {errors.thumbnail && <p className="text-red-500">{errors.thumbnail}</p>}
            </div>
            <div className="mb-4">
                <h2 className="text-xl mb-2">Content:</h2>
            </div>
            <div id="editorjs" className="border prose p-4 mb-4 overflow-hidden"></div>
            <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">Save</button>
            <pre ref={outputRef} className="mt-4 p-4 border rounded bg-gray-100 overflow-hidden"></pre>
            {savedData && (
                <div className="mt-4 p-4 border overflow-hidden">
                    <h2 className="text-xl mb-2">Saved Data:</h2>
                    <p><strong>Publisher:</strong> {savedData.publisher}</p>
                    <p><strong>Date:</strong> {savedData.date}</p>
                    <p><strong>Is Verified:</strong> {savedData.isVerified ? 'Yes' : 'No'}</p>
                    <p><strong>Category:</strong> {savedData.category}</p>
                    <p><strong>Preferred Section:</strong> {savedData.preferredSection}</p>
                    <p><strong>Title:</strong> {savedData.title}</p>
                    <p><strong>Thumbnail:</strong> {savedData.thumbnail ? savedData.thumbnail.name : 'No file selected'}</p>
                    <p><strong>Content:</strong></p>
                    <pre>{JSON.stringify(savedData.content, null, 4)}</pre>
                </div>
            )}
        </div>
    );
};

export default App;
