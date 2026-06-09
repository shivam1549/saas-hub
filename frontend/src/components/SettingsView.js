import React from 'react';
import { Save, Trash2, Globe, Lock } from 'lucide-react';

const SettingsView = () => {
  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Project Settings</h3>
          <p className="text-sm text-slate-500 mt-1">Manage your project preferences and visibility.</p>
        </div>

        <div className="p-8 space-y-8">
          {/* General Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-sm font-semibold text-slate-700">General Information</div>
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Project Name</label>
                <input type="text" defaultValue="Brass Lights Inventory" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                <textarea rows="3" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none" defaultValue="Tracking international shipments and customs clearance for Q2." />
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Privacy Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-sm font-semibold text-slate-700">Privacy & Access</div>
            <div className="md:col-span-2 space-y-4">
               <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex gap-3">
                    <Globe className="text-blue-600" size={20} />
                    <div>
                      <p className="text-sm font-bold text-blue-900">Public Project</p>
                      <p className="text-xs text-blue-700">Visible to everyone in your organization.</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-blue-600 underline">Change</button>
               </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Danger Zone */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-sm font-semibold text-red-600">Danger Zone</div>
            <div className="md:col-span-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-bold">
                <Trash2 size={16} /> Delete this project
              </button>
            </div>
          </section>
        </div>

        <div className="bg-slate-50 p-6 flex justify-end gap-3">
           <button className="px-6 py-2 text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all flex items-center gap-2">
             <Save size={16} /> Save Changes
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;