import React, { useState } from "react";
import { ActivityLogItem } from "../types";
import { Search, History, Filter } from "lucide-react";

interface ActivityLogPageProps {
  activityLog: ActivityLogItem[];
}

export const ActivityLogPage: React.FC<ActivityLogPageProps> = ({ activityLog }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const filtered = activityLog.filter((item) => {
    const matchesSearch =
      item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "ALL" || item.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white">System Activity Audit Trail</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Complete server-side record of administrative operations, publishing toggles, and data changes.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by details, entity, or admin email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer"
        >
          <option value="ALL">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="PUBLISH">PUBLISH</option>
          <option value="UPLOAD_MEDIA">UPLOAD_MEDIA</option>
          <option value="REORDER">REORDER</option>
          <option value="SETUP">SETUP</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-[#141417] border border-zinc-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[11px] font-mono uppercase text-zinc-400 bg-zinc-900/50">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Admin Email</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs font-mono">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No activity records found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-500/15 text-brand-400 border border-brand-500/30">
                        {item.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-semibold">{item.entity}</td>
                    <td className="py-3 px-4 text-zinc-300 max-w-sm truncate" title={item.details}>
                      {item.details}
                    </td>
                    <td className="py-3 px-4 text-zinc-500">{item.userEmail}</td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          item.status === "SUCCESS" ? "bg-brand-400" : "bg-red-400"
                        }`}
                        title={item.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
