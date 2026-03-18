import { useEffect, useState } from "react";
import type { VenueSummary } from "@show-booking/types";
import { getUsers, updateUserRoles, UserSummary, provisionUser } from "../../services/userService";
import { Modal } from "../../components/Modal";
import { getVenues } from "../../services/venueService";

export function ManageUsersPage() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [venues, setVenues] = useState<VenueSummary[]>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    void Promise.all([fetchUsers(), fetchVenues()]);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to synchronize identity database.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      const data = await getVenues();
      setVenues(data);
    } catch {
      setVenues([]);
    }
  };

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await provisionUser(newUser);
      setIsModalOpen(false);
      fetchUsers();
      setNewUser({ name: "", email: "", password: "" });
    } catch (err) {
      alert("Failed to provision new identity.");
    }
  };

  const handleRoleUpdate = async (userId: number, roles: string[], venueIds: number[]) => {
    try {
      await updateUserRoles(userId, roles, venueIds);
      setIsRoleModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Role update failed:", err);
      alert("Failed to update security clearance levels. Check logs for details.");
    }
  };

  const isOrganizerSelected = selectedUser?.roles.includes("ORGANIZER") ?? false;

  const toggleSelectedVenue = (venueId: number) => {
    setSelectedUser((current) => {
      if (!current) return current;

      const exists = current.organizerVenues.some((venue) => venue.id === venueId);
      const venueToAdd = venues.find((venue) => venue.id === venueId);
      if (!exists && !venueToAdd) {
        return current;
      }

      const organizerVenues = exists
        ? current.organizerVenues.filter((venue) => venue.id !== venueId)
        : [...current.organizerVenues, venueToAdd as VenueSummary];

      return {
        ...current,
        organizerVenues,
      };
    });
  };

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between gap-8">
        <div>
           <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-500 mb-2">Access Governance</p>
           <h1 className="font-display text-5xl font-black text-white">Identity Management</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-premium !py-4 !px-8 text-sm group"
        >
           <svg className="h-4 w-4 mr-2 inline-block transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
           </svg>
           Provision New Identity
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Provision New Identity"
      >
        <form onSubmit={handleProvision} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Name</label>
            <input 
              type="text" 
              required
              value={newUser.name}
              onChange={e => setNewUser({...newUser, name: e.target.value})}
              placeholder="e.g. Alexander Vance" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Corporate Email</label>
            <input 
              type="email" 
              required
              value={newUser.email}
              onChange={e => setNewUser({...newUser, email: e.target.value})}
              placeholder="vance@stagepass.local" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Credentials (Password)</label>
            <input 
              type="password" 
              required
              value={newUser.password}
              onChange={e => setNewUser({...newUser, password: e.target.value})}
              placeholder="••••••••" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-500 transition-all"
            />
          </div>
          <div className="pt-6 flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-8 py-4 rounded-2xl border border-white/10 text-slate-500 font-bold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn-premium px-12 py-4"
            >
              Establish Handshake
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
        title="Override Security Clearances"
      >
        <div className="space-y-8">
           <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Target Identity</p>
              <h3 className="text-xl font-black text-white">{selectedUser?.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{selectedUser?.email}</p>
           </div>
           
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Authorization Level</label>
              <div className="grid grid-cols-1 gap-4">
                 {["ADMIN", "ORGANIZER", "STAFF", "USER"].map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedUser(prev => prev ? {
                        ...prev,
                        roles: [role],
                        organizerVenues: role === "ORGANIZER" ? prev.organizerVenues : [],
                      } : null)}
                      className={`group relative overflow-hidden flex items-center justify-between p-6 rounded-3xl border transition-all ${
                        selectedUser?.roles.includes(role) 
                        ? "bg-brand-500/10 border-brand-500/50 text-brand-400" 
                        : "bg-white/5 border-white/10 text-slate-400 hover:border-brand-500/30 hover:bg-white/[0.08]"
                      }`}
                    >
                       <div className="flex items-center gap-4">
                          <div className={`h-2 w-2 rounded-full ${selectedUser?.roles.includes(role) ? "bg-brand-500 shadow-[0_0_12px_rgba(235,46,121,0.5)]" : "bg-slate-700"}`} />
                          <span className="font-bold uppercase tracking-widest text-xs">{role}</span>
                       </div>
                       {selectedUser?.roles.includes(role) && (
                         <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                         </svg>
                       )}
                    </button>
                 ))}
              </div>
            </div>

            {isOrganizerSelected && (
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Assigned Venues</label>
                <div className="grid grid-cols-1 gap-3">
                  {venues.map((venue) => {
                    const selected = selectedUser?.organizerVenues.some((item) => item.id === venue.id) ?? false;
                    return (
                      <button
                        key={venue.id}
                        type="button"
                        onClick={() => toggleSelectedVenue(venue.id)}
                        className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                          selected
                            ? "border-brand-500/50 bg-brand-500/10 text-brand-300"
                            : "border-white/10 bg-white/5 text-slate-400 hover:border-brand-500/30"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-bold text-white">{venue.name}</p>
                          <p className="mt-1 text-xs text-slate-400">{venue.city}</p>
                        </div>
                        {selected && (
                          <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500">
                  Organizer accounts can manage only the shows linked to the venues selected here.
                </p>
              </div>
            )}
            
            <div className="pt-6 flex justify-end gap-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-8 py-4 rounded-2xl border border-white/10 text-slate-500 font-bold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => selectedUser && handleRoleUpdate(
                    selectedUser.id,
                    selectedUser.roles,
                    selectedUser.organizerVenues.map((venue) => venue.id),
                  )}
                  className="btn-premium px-12 py-4"
                >
                  Synchronize Authorization
                </button>
            </div>
        </div>
      </Modal>

      <div className="overflow-hidden rounded-[40px] border border-white/5 bg-white/5 shadow-2xl">
         <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex gap-4">
               <input 
                 type="text" 
                 placeholder="Search by identity or email..." 
                 className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-brand-500 w-80 transition-all placeholder:text-slate-600"
               />
               <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-brand-500 transition-all">
                  <option className="bg-slate-900">All Permissions</option>
                  <option className="bg-slate-900">Administrative</option>
                  <option className="bg-slate-900">Standard Member</option>
               </select>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
               {users.length} IDENTIFIED RECORDS
            </p>
         </div>
         
         <div className="relative min-h-[400px]">
            {loading ? (
              <div className="p-20 space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="p-20 text-center text-red-500">
                 {error}
              </div>
            ) : users.length === 0 ? (
              <div className="p-20 text-center">
                 <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[32px] bg-white/5 border border-white/10 shadow-inner">
                    <svg className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                 </div>
                 <h3 className="text-2xl font-black text-white">Identity database is currently disconnected.</h3>
                 <p className="mt-4 max-w-lg mx-auto text-lg text-slate-400">
                   Establish a secure handshake with the RBAC synchronization services.
                 </p>
                 <button 
                  onClick={fetchUsers}
                  className="mt-10 btn-premium text-xs px-12"
                 >
                   Initialize Handshake
                 </button>
              </div>
            ) : (
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
                       <th className="px-10 py-6">Identity</th>
                       <th className="px-10 py-6">Email Address</th>
                       <th className="px-10 py-6">Privileges</th>
                       <th className="px-10 py-6">Synchronization Date</th>
                       <th className="px-10 py-6">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {users.map((user) => (
                       <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-xs font-black text-brand-500">
                                  {user.name.charAt(0)}
                               </div>
                               <span className="font-bold text-white group-hover:text-brand-400 transition-colors uppercase tracking-tight">{user.name}</span>
                            </div>
                         </td>
                         <td className="px-10 py-6 text-sm text-slate-400">{user.email}</td>
                         <td className="px-10 py-6">
                            <div className="flex gap-2">
                               {user.roles.map(role => (
                                 <span key={role} className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-500">
                                   {role}
                                 </span>
                               ))}
                            </div>
                            {user.organizerVenues.length > 0 && (
                              <p className="mt-3 text-xs text-slate-500">
                                Venues: {user.organizerVenues.map((venue) => venue.name).join(", ")}
                              </p>
                            )}
                         </td>
                         <td className="px-10 py-6 text-xs text-slate-500 font-medium">
                            {new Date(user.createdAt).toLocaleDateString()}
                         </td>
                         <td className="px-10 py-6">
                            <button 
                              onClick={() => {
                                setSelectedUser(user);
                                setIsRoleModalOpen(true);
                              }}
                              className="text-xs font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
                            >
                               Modify Access
                            </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
