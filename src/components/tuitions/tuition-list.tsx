
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, BookOpen, X } from "lucide-react";

import TuitionCard from "@/components/tuitions/tuition-card";
import type { Tuition } from "@/lib/actions/tuitions";

interface TuitionListProps {
  tuitions: Tuition[];
}

export default function TuitionList({ tuitions }: TuitionListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [subject, setSubject] = useState(searchParams.get("subject") || "all");
  const [classLevel, setClassLevel] = useState(
    searchParams.get("classLevel") || "all"
  );
  const [mode, setMode] = useState(searchParams.get("mode") || "all");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setSubject(searchParams.get("subject") || "all");
    setClassLevel(searchParams.get("classLevel") || "all");
    setMode(searchParams.get("mode") || "all");
  }, [searchParams]);

  const subjects = useMemo(
    () => [...new Set(tuitions.map((tuition) => tuition.subject))].sort(),
    [tuitions]
  );

  const classLevels = useMemo(
    () => [...new Set(tuitions.map((tuition) => tuition.classLevel))].sort(),
    [tuitions]
  );

  function updateFilters(values: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(values).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();

    router.replace(query ? `/tuitions?${query}` : "/tuitions", {
      scroll: false,
    });
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateFilters({ search: search.trim() });
  }

  function clearFilters() {
    setSearch("");
    setSubject("all");
    setClassLevel("all");
    setMode("all");

    router.replace("/tuitions", { scroll: false });
  }

  const hasActiveFilters =
    search !== "" ||
    subject !== "all" ||
    classLevel !== "all" ||
    mode !== "all";

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-[#B58A35]">
            AVAILABLE OPPORTUNITIES
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#183F38]">
            Explore Tuitions
          </h2>

          <p className="mt-2 text-sm text-[#68736C]">
            Find learning opportunities that match your needs.
          </p>
        </div>

        <p className="text-sm font-semibold text-[#183F38]">
          {tuitions.length} matching tuitions
        </p>
      </div>

      <div className="rounded-3xl border border-[#183F38]/10 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <form onSubmit={handleSearch}>
            <label
              htmlFor="tuition-search"
              className="mb-2 block text-sm font-semibold text-[#183F38]"
            >
              Search Tuitions
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[#183F38]/15 bg-[#F7F4EC] px-4">
              <Search size={19} className="shrink-0 text-[#B58A35]" />

              <input
                id="tuition-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title or subject..."
                className="w-full bg-transparent py-3 text-sm text-[#242C2A] outline-none placeholder:text-[#89918B]"
              />

              <button
                type="submit"
                aria-label="Search tuitions"
                className="text-[#183F38] hover:text-[#B58A35]"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          <div>
            <label
              htmlFor="subject-filter"
              className="mb-2 block text-sm font-semibold text-[#183F38]"
            >
              Subject
            </label>

            <select
              id="subject-filter"
              value={subject}
              onChange={(e) => {
                const value = e.target.value;
                setSubject(value);
                updateFilters({ subject: value });
              }}
              className="w-full rounded-xl border border-[#183F38]/15 bg-[#F7F4EC] px-4 py-3 text-sm text-[#242C2A] outline-none focus:border-[#B58A35]"
            >
              <option value="all">All Subjects</option>

              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="class-filter"
              className="mb-2 block text-sm font-semibold text-[#183F38]"
            >
              Class Level
            </label>

            <select
              id="class-filter"
              value={classLevel}
              onChange={(e) => {
                const value = e.target.value;
                setClassLevel(value);
                updateFilters({ classLevel: value });
              }}
              className="w-full rounded-xl border border-[#183F38]/15 bg-[#F7F4EC] px-4 py-3 text-sm text-[#242C2A] outline-none focus:border-[#B58A35]"
            >
              <option value="all">All Class Levels</option>

              {classLevels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="mode-filter"
              className="mb-2 block text-sm font-semibold text-[#183F38]"
            >
              Learning Mode
            </label>

            <select
              id="mode-filter"
              value={mode}
              onChange={(e) => {
                const value = e.target.value;
                setMode(value);
                updateFilters({ mode: value });
              }}
              className="w-full rounded-xl border border-[#183F38]/15 bg-[#F7F4EC] px-4 py-3 text-sm text-[#242C2A] outline-none focus:border-[#B58A35]"
            >
              <option value="all">All Modes</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#A34E37] transition hover:text-[#183F38]"
          >
            <X size={16} />
            Clear all filters
          </button>
        )}
      </div>

      <div className="mt-10">
        {tuitions.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition) => (
              <TuitionCard key={tuition._id} tuition={tuition} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#183F38]/20 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DCE9E2] text-[#183F38]">
              {hasActiveFilters ? (
                <SlidersHorizontal size={28} />
              ) : (
                <BookOpen size={28} />
              )}
            </div>

            <h3 className="mt-6 text-xl font-bold text-[#183F38]">
              {hasActiveFilters
                ? "No matching tuitions found"
                : "No tuition listings yet"}
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#68736C]">
              {hasActiveFilters
                ? "Try changing your search or filters to find more opportunities."
                : "There are currently no approved tuition opportunities available."}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-7 rounded-full bg-[#183F38] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#28584E]"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
