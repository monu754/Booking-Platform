import { useEffect, useState } from "react";
import type { ShowSummary } from "@show-booking/types";
import { getShows, deleteShow, createShow } from "../../services/showService";
import { Modal } from "../../components/Modal";
import { PosterArtwork } from "../../components/PosterArtwork";

export function ManageShowsPage() {
  const [shows, setShows] = useState<ShowSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSource, setImageSource] = useState<"url" | "upload">("url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newShow, setNewShow] = useState({
    title: "",
    description: "",
    duration: 120,
    language: "English",
    genre: "Theater",
    posterUrl: ""
  });

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);
      const data = await getShows();
      setShows(data);
    } catch (err) {
      setError("Failed to load shows.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createShow({
        title: newShow.title,
        description: newShow.description,
        duration: newShow.duration,
        language: newShow.language,
        genre: newShow.genre,
        posterUrl: imageSource === "url" ? newShow.posterUrl : ""
      }, imageSource === "upload" ? (selectedFile || undefined) : undefined);
      
      setIsModalOpen(false);
      fetchShows();
      setNewShow({ title: "", description: "", duration: 120, language: "English", genre: "Theater", posterUrl: "" });
      setSelectedFile(null);
    } catch (err) {
      alert("Failed to create show.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this show? This action is permanent.")) return;
    try {
      await deleteShow(id);
      setShows(shows.filter(s => s.id !== id));
    } catch (err) {
      alert("Failed to delete show.");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between gap-8">
        <div>
           <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-500 mb-2">Inventory Control</p>
           <h1 className="font-display text-5xl font-black text-white">Show Management</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-premium !py-4 !px-8 text-sm group"
        >
           <svg className="h-4 w-4 mr-2 inline-block transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
           </svg>
           Create Performance
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Provision New Performance"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Show Title</label>
              <input 
                type="text" 
                required
                value={newShow.title}
                onChange={e => setNewShow({...newShow, title: e.target.value})}
                placeholder="e.g. Midnight Echoes" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Genre</label>
              <select 
                value={newShow.genre}
                onChange={e => setNewShow({...newShow, genre: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-500 transition-all"
              >
                <option value="Theater" className="bg-slate-900">Theater</option>
                <option value="Opera" className="bg-slate-900">Opera</option>
                <option value="Jazz" className="bg-slate-900">Jazz</option>
                <option value="Musical" className="bg-slate-900">Musical</option>
                <option value="Concert" className="bg-slate-900">Concert</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Duration (mins)</label>
              <input 
                type="number" 
                required
                value={newShow.duration}
                onChange={e => setNewShow({...newShow, duration: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Language</label>
              <input 
                type="text" 
                required
                value={newShow.language}
                onChange={e => setNewShow({...newShow, language: e.target.value})}
                placeholder="e.g. English" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Description</label>
            <textarea 
              required
              rows={4}
              value={newShow.description}
              onChange={e => setNewShow({...newShow, description: e.target.value})}
              placeholder="Provide a compelling narrative for this performance..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-500 transition-all resize-none"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Poster Image</label>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <button 
                  type="button"
                  onClick={() => setImageSource("url")}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${imageSource === "url" ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" : "text-slate-500 hover:text-slate-300"}`}
                >
                  URL
                </button>
                <button 
                  type="button"
                  onClick={() => setImageSource("upload")}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${imageSource === "upload" ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" : "text-slate-500 hover:text-slate-300"}`}
                >
                  Upload
                </button>
              </div>
            </div>
            
            {imageSource === "url" ? (
              <input 
                type="text" 
                value={newShow.posterUrl}
                onChange={e => setNewShow({...newShow, posterUrl: e.target.value})}
                placeholder="https://images.unsplash.com/..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-500 transition-all"
              />
            ) : (
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full bg-white/5 border-2 border-dashed border-white/10 rounded-2xl px-6 py-8 text-center group-hover:border-brand-500/50 transition-all">
                  <svg className="h-8 w-8 mx-auto mb-4 text-slate-500 group-hover:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                    {selectedFile ? selectedFile.name : "Select image from device"}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-widest font-black">JPG, PNG, WebP up to 10MB</p>
                </div>
              </div>
            )}
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
              Confirm Synchronize
            </button>
          </div>
        </form>
      </Modal>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-[32px] border border-white/5 bg-white/5 p-8 animate-pulse">
               <div className="h-48 rounded-2xl bg-white/5 mb-6" />
               <div className="h-4 w-2/3 bg-white/10 rounded-full mb-4" />
               <div className="h-4 w-1/2 bg-white/10 rounded-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[40px] border border-red-500/20 bg-red-500/5 p-12 text-center text-red-500">
           {error}
        </div>
      ) : shows.length === 0 ? (
        <div className="rounded-[40px] border border-white/5 bg-white/5 p-12 text-center overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent" />
           <div className="relative z-10">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[32px] bg-white/5 border border-white/10 shadow-inner">
                 <svg className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                 </svg>
              </div>
              <h3 className="text-2xl font-black text-white">No active performances found.</h3>
              <p className="mt-4 max-w-lg mx-auto text-lg text-slate-400">
                Your inventory is currently empty.
              </p>
           </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {shows.map((show) => (
            <div key={show.id} className="group rounded-[40px] border border-white/5 bg-white/5 p-8 hover:border-white/10 transition-all duration-500 hover:shadow-2xl">
              <div className="relative h-48 rounded-2xl bg-white/5 mb-6 overflow-hidden flex items-center justify-center border border-white/5">
                <PosterArtwork
                  title={show.title}
                  posterUrl={show.posterUrl}
                  className="h-full w-full"
                  imageClassName="h-full w-full object-cover"
                  fallbackClassName="flex h-full w-full items-center justify-center bg-white/5 px-4"
                  titleClassName="text-center font-display text-2xl font-black uppercase tracking-widest text-white/10 transition-colors group-hover:text-brand-500/20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                   <button 
                     onClick={() => handleDelete(show.id)}
                     className="h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/40 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                   >
                     <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                   </button>
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-500 mb-2">{show.genre}</p>
              <h3 className="text-xl font-black text-white group-hover:text-brand-400 transition-colors line-clamp-1">{show.title}</h3>
              <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5">
                <span className="text-xs font-bold text-slate-500 italic">{show.durationMinutes} mins</span>
                <span className="text-xs font-black text-white uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">{show.language}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
