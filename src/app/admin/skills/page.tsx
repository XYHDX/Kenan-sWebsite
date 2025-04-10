'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BarChart, CheckCircle, Plus, Save, Trash2, Edit } from 'lucide-react';

const SkillsEditor = () => {
  // In a real implementation, this data would come from an API
  const [programmingSkills, setProgrammingSkills] = useState([
    { id: 1, name: 'Python', level: 80 },
    { id: 2, name: 'C/C++', level: 70 }
  ]);

  const [roboticsSkills, setRoboticsSkills] = useState([
    { id: 1, name: 'ROS', level: 90 },
    { id: 2, name: 'Arduino', level: 100 },
    { id: 3, name: 'Raspberry Pi', level: 80 },
    { id: 4, name: 'Robo Analyzer', level: 70 }
  ]);

  const [networkingSkills, setNetworkingSkills] = useState([
    { id: 1, name: 'Cisco Networking (CCNA)', level: 80 },
    { id: 2, name: 'Packet tracer', level: 80 }
  ]);

  const [otherSkills, setOtherSkills] = useState([
    { id: 1, name: 'Troubleshooting & Diagnostics' },
    { id: 2, name: 'Cross-functional Collaboration' },
    { id: 3, name: 'Problem Solving & Critical Thinking' }
  ]);

  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleEdit = (skill: any, category: string) => {
    setEditingSkill({...skill});
    setEditingCategory(category);
    setIsEditing(true);
  };

  const handleNew = (category: string) => {
    setEditingSkill({
      id: Date.now(), // Temporary ID
      name: '',
      level: category !== 'other' ? 50 : undefined
    });
    setEditingCategory(category);
    setIsEditing(true);
  };

  const handleDelete = async (id: number, category: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      // In a real implementation, this would make an API call to delete the data
      if (category === 'programming') {
        setProgrammingSkills(programmingSkills.filter(skill => skill.id !== id));
      } else if (category === 'robotics') {
        setRoboticsSkills(roboticsSkills.filter(skill => skill.id !== id));
      } else if (category === 'networking') {
        setNetworkingSkills(networkingSkills.filter(skill => skill.id !== id));
      } else if (category === 'other') {
        setOtherSkills(otherSkills.filter(skill => skill.id !== id));
      }
      
      setSaveMessage('Skill deleted successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingSkill((prev: any) => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    try {
      // In a real implementation, this would make an API call to save the data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingCategory === 'programming') {
        if (programmingSkills.some(skill => skill.id === editingSkill.id)) {
          setProgrammingSkills(programmingSkills.map(skill => 
            skill.id === editingSkill.id ? editingSkill : skill
          ));
        } else {
          setProgrammingSkills([...programmingSkills, editingSkill]);
        }
      } else if (editingCategory === 'robotics') {
        if (roboticsSkills.some(skill => skill.id === editingSkill.id)) {
          setRoboticsSkills(roboticsSkills.map(skill => 
            skill.id === editingSkill.id ? editingSkill : skill
          ));
        } else {
          setRoboticsSkills([...roboticsSkills, editingSkill]);
        }
      } else if (editingCategory === 'networking') {
        if (networkingSkills.some(skill => skill.id === editingSkill.id)) {
          setNetworkingSkills(networkingSkills.map(skill => 
            skill.id === editingSkill.id ? editingSkill : skill
          ));
        } else {
          setNetworkingSkills([...networkingSkills, editingSkill]);
        }
      } else if (editingCategory === 'other') {
        if (otherSkills.some(skill => skill.id === editingSkill.id)) {
          setOtherSkills(otherSkills.map(skill => 
            skill.id === editingSkill.id ? editingSkill : skill
          ));
        } else {
          setOtherSkills([...otherSkills, editingSkill]);
        }
      }
      
      setIsEditing(false);
      setSaveMessage('Skill saved successfully!');
    } catch (err) {
      setSaveMessage('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderSkillList = (skills: any[], category: string) => (
    <div className="space-y-4">
      {skills.map((skill) => (
        <div key={skill.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900">{skill.name}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(skill, category)}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded flex items-center text-sm hover:bg-blue-100 transition-colors"
              >
                <Edit size={14} className="mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(skill.id, category)}
                className="bg-red-50 text-red-700 px-3 py-1 rounded flex items-center text-sm hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} className="mr-1" /> Delete
              </button>
            </div>
          </div>
          
          {category !== 'other' && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Proficiency</span>
                <span className="text-gray-600">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <AdminLayout activePage="skills">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Skills</h1>
        <p className="text-gray-600">Add, edit, or remove your technical and professional skills</p>
      </div>

      {saveMessage && (
        <div className={`p-4 mb-6 rounded-md ${saveMessage.includes('error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {saveMessage}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingSkill.id && 
              ((editingCategory === 'programming' && programmingSkills.some(skill => skill.id === editingSkill.id)) ||
               (editingCategory === 'robotics' && roboticsSkills.some(skill => skill.id === editingSkill.id)) ||
               (editingCategory === 'networking' && networkingSkills.some(skill => skill.id === editingSkill.id)) ||
               (editingCategory === 'other' && otherSkills.some(skill => skill.id === editingSkill.id)))
              ? 'Edit Skill' 
              : 'Add New Skill'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editingSkill.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Skill name"
                required
              />
            </div>

            {editingCategory !== 'other' && (
              <div className="mb-6">
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Proficiency Level (%)
                </label>
                <input
                  type="range"
                  id="level"
                  name="level"
                  min="0"
                  max="100"
                  step="5"
                  value={editingSkill.level}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">Beginner</span>
                  <span className="text-xs text-gray-500">Intermediate</span>
                  <span className="text-xs text-gray-500">Expert</span>
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm font-medium text-gray-700">{editingSkill.level}%</span>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`flex items-center px-6 py-2 rounded-md text-white ${
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
          {/* Programming Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <BarChart size={20} className="mr-2 text-blue-600" />
                Programming Languages
              </h2>
              <button
                onClick={() => handleNew('programming')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus size={18} className="mr-2" /> Add Skill
              </button>
            </div>
            {renderSkillList(programmingSkills, 'programming')}
          </div>

          {/* Robotics Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <BarChart size={20} className="mr-2 text-blue-600" />
                Robotics Platforms
              </h2>
              <button
                onClick={() => handleNew('robotics')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus size={18} className="mr-2" /> Add Skill
              </button>
            </div>
            {renderSkillList(roboticsSkills, 'robotics')}
          </div>

          {/* Networking Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <BarChart size={20} className="mr-2 text-blue-600" />
                Networking
              </h2>
              <button
                onClick={() => handleNew('networking')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus size={18} className="mr-2" /> Add Skill
              </button>
            </div>
            {renderSkillList(networkingSkills, 'networking')}
          </div>

          {/* Other Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <CheckCircle size={20} className="mr-2 text-blue-600" />
                Other Skills
              </h2>
              <button
                onClick={() => handleNew('other')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus size={18} className="mr-2" /> Add Skill
              </button>
            </div>
            {renderSkillList(otherSkills, 'other')}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default SkillsEditor;
