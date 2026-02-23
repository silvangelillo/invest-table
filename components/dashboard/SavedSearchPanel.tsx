"use client";

import { useState, useCallback } from "react";
import { Bell, BellOff, Trash2, Plus, Search } from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { matchesFilters, formatDate } from "@/lib/utils";
import { MOCK_SAVED_SEARCHES, MOCK_STARTUPS } from "@/lib/mock-data";
import type { SavedSearch, StartupCategory, AppNotification } from "@/types";
import { toast } from "sonner";

// ── Simulate a notification when a new startup matches a saved search ─────────
function simulateMatchNotification(search: SavedSearch): void {
  const matches = MOCK_STARTUPS.filter((s) => matchesFilters(s, search.filters));
  if (matches.length > 0 && search.alerts_enabled) {
    const startup = matches[0];
    toast.custom((id) => (
      <div className="bg-white border border-gray-100 shadow-glass-xl rounded-2xl p-4 flex items-start gap-3 w-80">
        <span className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <Bell className="w-4 h-4 text-blue-600" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">Alert: {search.label}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            <span className="font-medium text-gray-700">{startup.name}</span> in {startup.city} matches your search
          </p>
          <CategoryBadge category={startup.category} size="sm" />
        </div>
      </div>
    ));
  } else {
    toast.info(`No current matches for "${search.label}"`);
  }
}

interface SavedSearchRowProps {
  search: SavedSearch;
  onToggleAlert: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
  onTest: (search: SavedSearch) => void;
}

function SavedSearchRow({ search, onToggleAlert, onDelete, onTest }: SavedSearchRowProps) {
  const cats = search.filters.categories ?? [];
  const hasCity = !!search.filters.city;

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100/70 transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <p className="text-sm font-semibold text-gray-900">{search.label}</p>
          {cats.map((c) => (
            <CategoryBadge key={c} category={c as StartupCategory} size="sm" />
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {hasCity && <span>📍 {search.filters.city}</span>}
          {search.filters.funding_stage && <span>💰 {search.filters.funding_stage}</span>}
          <span>{formatDate(search.created_at)}</span>
        </div>
      </div>

      {/* Alert toggle */}
      <div className="flex items-center gap-2">
        {search.alerts_enabled ? (
          <Bell className="w-4 h-4 text-blue-500" />
        ) : (
          <BellOff className="w-4 h-4 text-gray-300" />
        )}
        <Toggle
          checked={search.alerts_enabled}
          onChange={(v) => onToggleAlert(search.id, v)}
        />
      </div>

      {/* Test notification button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onTest(search)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        title="Simulate alert"
      >
        Test
      </Button>

      {/* Delete */}
      <button
        onClick={() => onDelete(search.id)}
        className="p-1.5 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── New Search Modal (simplified) ─────────────────────────────────────────────
function NewSearchForm({ onSave }: { onSave: (s: SavedSearch) => void }) {
  const [label, setLabel] = useState("");
  const [city, setCity] = useState("");
  const [cats, setCats] = useState<StartupCategory[]>([]);

  const allCats: StartupCategory[] = ["Tech", "Food", "Service", "Sustainability"];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      investor_id: "demo-investor",
      label: label.trim(),
      filters: {
        ...(cats.length ? { categories: cats } : {}),
        ...(city.trim() ? { city: city.trim() } : {}),
      },
      alerts_enabled: true,
      created_at: new Date().toISOString(),
    });
    setLabel(""); setCity(""); setCats([]);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
      <h4 className="text-sm font-semibold text-blue-900">New Saved Search</h4>
      <input
        className="w-full px-3 py-2 text-sm rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Label (e.g. Tech in Berlin)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        required
      />
      <input
        className="w-full px-3 py-2 text-sm rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="City (optional)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {allCats.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() =>
              setCats(cats.includes(cat) ? cats.filter((c) => c !== cat) : [...cats, cat])
            }
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              cats.includes(cat)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <Button type="submit" size="sm" className="w-full">
        Save Search & Enable Alerts
      </Button>
    </form>
  );
}

// ── Main Panel ────────────────────────────────────────────────────────────────
export function SavedSearchPanel() {
  const [searches, setSearches] = useState<SavedSearch[]>(MOCK_SAVED_SEARCHES);
  const [showNew, setShowNew] = useState(false);

  const toggleAlert = useCallback((id: string, enabled: boolean) => {
    setSearches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, alerts_enabled: enabled } : s))
    );
    toast.success(enabled ? "Alerts enabled" : "Alerts paused");
  }, []);

  const deleteSearch = useCallback((id: string) => {
    setSearches((prev) => prev.filter((s) => s.id !== id));
    toast.success("Search removed");
  }, []);

  const addSearch = useCallback((s: SavedSearch) => {
    setSearches((prev) => [s, ...prev]);
    setShowNew(false);
    toast.success("Saved search created!");
    // Immediately simulate notification
    simulateMatchNotification(s);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">Saved Searches</h3>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
              {searches.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNew(!showNew)}
            className="gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </Button>
        </div>
      </CardHeader>

      <CardBody className="space-y-3">
        {showNew && <NewSearchForm onSave={addSearch} />}

        {searches.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-200" />
            <p className="text-sm">No saved searches yet</p>
            <p className="text-xs mt-1">Create one to get alerts when new startups match</p>
          </div>
        ) : (
          searches.map((s) => (
            <SavedSearchRow
              key={s.id}
              search={s}
              onToggleAlert={toggleAlert}
              onDelete={deleteSearch}
              onTest={simulateMatchNotification}
            />
          ))
        )}
      </CardBody>
    </Card>
  );
}
