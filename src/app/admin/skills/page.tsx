'use client';

import { useState, useEffect } from 'react';
import { Code, Cpu, Edit, Plus, Save, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Skill {
  id: string | number;
  name: string;
  level: number;
  category: string;
}

const SkillsEditor = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/admin/skills');
      if (!response.ok) {
        throw new Error(`Failed to fetch skills: ${response.statusText}`);
      }
      const data = await response.json() as Skill[];
      setSkills(data);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map(skill => skill.category)));
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to load skills. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleNew = () => {
    setEditingSkill({
      id: Date.now(),
      name: '',
      level: 85,
      category: categories.length > 0 ? categories[0] : 'Frontend'
    });
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        setIsSaving(true);
        const updatedSkills = skills.filter(skill => skill.id !== id);
        await saveSkills(updatedSkills);
        setSaveMessage('Skill deleted successfully');
      } catch (error) {
        setErrorMessage(`Error deleting skill: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCategoryChange = async (oldCategory: string, newCategory: string) => {
    if (oldCategory === newCategory) return;
    
    try {
      setIsSaving(true);
      // Update all skills in the category
      const updatedSkills = skills.map(skill => 
        skill.category === oldCategory ? { ...skill, category: newCategory } : skill
      );
      
      await saveSkills(updatedSkills);
      // Update categories
      const updatedCategories = categories.map(cat => cat === oldCategory ? newCategory : cat);
      setCategories(updatedCategories);
      
      setSaveMessage('Category updated successfully');
    } catch (error) {
      setErrorMessage(`Error updating category: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = () => {
    const newCategory = prompt('Enter new category name:');
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      if (editingSkill) {
        setEditingSkill({...editingSkill, category: newCategory});
      }
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (window.confirm(`Are you sure you want to delete the &quot;${category}&quot; category and all its skills?`)) {
      try {
        setIsSaving(true);
        // Remove all skills in this category
        const updatedSkills = skills.filter(skill => skill.category !== category);
        await saveSkills(updatedSkills);
        
        // Update categories
        const updatedCategories = categories.filter(cat => cat !== category);
        setCategories(updatedCategories);
        
        setSaveMessage('Category and its skills deleted successfully');
      } catch (error) {
        setErrorMessage(`Error deleting category: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!editingSkill) return;
    
    if (name === 'level') {
      setEditingSkill({
        ...editingSkill,
        [name]: parseInt(value, 10)
      });
    } else {
      setEditingSkill({
        ...editingSkill,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    
    try {
      setIsSaving(true);
      let updatedSkills;
      
      if (skills.some(skill => skill.id === editingSkill.id)) {
        // Update existing skill
        updatedSkills = skills.map(skill => 
          skill.id === editingSkill.id ? editingSkill : skill
        );
      } else {
        // Add new skill
        updatedSkills = [...skills, editingSkill];
      }
      
      await saveSkills(updatedSkills);
      setEditingSkill(null);
      setSaveMessage('Skill saved successfully');
    } catch (error) {
      setErrorMessage(`Error saving skill: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const saveSkills = async (updatedSkills: Skill[]) => {
    const response = await fetch('/api/admin/skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSkills),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save: ${response.status} ${errorText}`);
    }

    setSkills(updatedSkills);
    return response.json();
  };

  // Group skills by category
  const skillsByCategory: Record<string, Skill[]> = {};
  categories.forEach(category => {
    skillsByCategory[category] = skills.filter(skill => skill.category === category);
  });

  return (
    <AdminLayout activePage="skills">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Skills</h1>
          <p className="text-gray-600">Add, edit, or remove your technical skills</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          disabled={isLoading}
        >
          <Plus size={18} className="mr-2" /> Add Skill
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 mb-6 rounded-md bg-green-50 text-green-700">
          {saveMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 mb-6 rounded-md bg-red-50 text-red-700">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading skills...</div>
      ) : editingSkill ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {skills.some(skill => skill.id === editingSkill.id) ? 'Edit' : 'Add'} Skill
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingSkill.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="flex">
                  <select
                    name="category"
                    value={editingSkill.category}
                    onChange={handleChange}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proficiency Level: {editingSkill.level}%
              </label>
              <input
                type="range"
                name="level"
                value={editingSkill.level}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setEditingSkill(null)}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSaving}
                className={`flex items-center px-5 py-2 rounded-md text-white ${
                  isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {isSaving ? 'Saving...' : 'Save Skill'}
                {!isSaving && <Save size={18} className="ml-2" />}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No skills added yet. Click the &quot;Add Skill&quot; button to add your first skill.
            </div>
          ) : (
            categories.map(category => (
              <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    {category === 'Frontend' && <Code size={20} className="mr-2 text-blue-600" />}
                    {category === 'Backend' && <Cpu size={20} className="mr-2 text-indigo-600" />}
                    {(!['Frontend', 'Backend'].includes(category)) && 
                      <Code size={20} className="mr-2 text-gray-600" />}
                    
                    <h2 className="text-xl font-semibold text-gray-800">{category}</h2>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const newName = prompt('Edit category name:', category);
                        if (newName && newName !== category) {
                          handleCategoryChange(category, newName);
                        }
                      }}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded flex items-center text-sm hover:bg-blue-100"
                    >
                      <Edit size={14} className="mr-1" /> Rename
                    </button>
                    
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="bg-red-50 text-red-700 px-3 py-1 rounded flex items-center text-sm hover:bg-red-100"
                    >
                      <Trash2 size={14} className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skillsByCategory[category]?.map(skill => (
                    <div key={skill.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-900">{skill.name}</h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {skill.level}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default SkillsEditor;
