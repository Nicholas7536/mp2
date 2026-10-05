import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Character, SortField, SortOrder } from '../types/character';
import { fetchAllCharacters } from '../api/dragonball';
import { parseKiValue } from '../utils/kiParser';
import styles from './ListView.module.css';

const ITEMS_PER_PAGE = 10;

export const ListView: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search input state (uncommitted input and committed query triggered on Enter)
  const [searchInput, setSearchInput] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>('');

  // Sorting state (at least 2 properties: Name and Base Ki)
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Pagination state (limit 10 on 1 page)
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    let isMounted = true;
    fetchAllCharacters()
      .then((data) => {
        if (isMounted) {
          setCharacters(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError('Failed to load characters for search.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    setActiveQuery(val.trim());
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchInput.trim());
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveQuery('');
    setCurrentPage(1);
  };

  // 1. Filter candidates by name based on active query
  const filteredList = useMemo(() => {
    if (!activeQuery) {
      return characters;
    }
    const q = activeQuery.toLowerCase();
    return characters.filter((c) => c.name.toLowerCase().includes(q));
  }, [characters, activeQuery]);

  // 2. Sort filtered candidates by Name or Ki in Ascending or Descending order
  const sortedList = useMemo(() => {
    const list = [...filteredList];

    list.sort((a, b) => {
      if (sortField === 'name') {
        const comp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        return sortOrder === 'asc' ? comp : -comp;
      }

      if (sortField === 'ki') {
        const kiA = parseKiValue(a.ki);
        const kiB = parseKiValue(b.ki);
        return sortOrder === 'asc' ? kiA - kiB : kiB - kiA;
      }

      return 0;
    });

    return list;
  }, [filteredList, sortField, sortOrder]);

  // 3. Paginate to 10 items per page
  const totalPages = Math.max(1, Math.ceil(sortedList.length / ITEMS_PER_PAGE));
  const effectivePage = Math.min(currentPage, totalPages);

  const paginatedList = useMemo(() => {
    const start = (effectivePage - 1) * ITEMS_PER_PAGE;
    return sortedList.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedList, effectivePage]);

  // Array of IDs from the sorted list for contextual Prev/Next cycling in Details View
  const characterIds = useMemo(() => sortedList.map((c) => c.id), [sortedList]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Character Search & Directory</h1>
        <p className={styles.subtitle}>
          Search Dragon Ball characters by name, sort by attributes, and browse paginated results
        </p>
      </div>

      {/* Search and Sort Controls */}
      <section className={styles.controlsBar} aria-label="Search and Sorting Controls">
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <div className={styles.searchInputWrapper}>
            <label htmlFor="search-input" className={styles.label}>
              Search by Name (Press Enter)
            </label>
            <input
              id="search-input"
              type="text"
              placeholder="e.g. Goku, Vegeta, Piccolo..."
              value={searchInput}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
          {activeQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className={styles.clearButton}
            >
              Clear
            </button>
          )}
        </form>

        <div className={styles.sortGroup}>
          <label htmlFor="sort-field" className={styles.label}>
            Sort Property
          </label>
          <select
            id="sort-field"
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className={styles.sortSelect}
          >
            <option value="name">Character Name</option>
            <option value="ki">Base Ki / Power Level</option>
          </select>
        </div>

        <div className={styles.orderToggle} role="group" aria-label="Sort Direction">
          <button
            type="button"
            className={`${styles.orderButton} ${sortOrder === 'asc' ? styles.orderButtonActive : ''}`}
            onClick={() => setSortOrder('asc')}
            title="Ascending order"
          >
            Ascending ▲
          </button>
          <button
            type="button"
            className={`${styles.orderButton} ${sortOrder === 'desc' ? styles.orderButtonActive : ''}`}
            onClick={() => setSortOrder('desc')}
            title="Descending order"
          >
            Descending ▼
          </button>
        </div>
      </section>

      {/* Meta Results Bar */}
      <div className={styles.resultsMeta}>
        <span>
          Showing{' '}
          <span className={styles.highlight}>
            {sortedList.length === 0 ? 0 : (effectivePage - 1) * ITEMS_PER_PAGE + 1}
          </span>
          –
          <span className={styles.highlight}>
            {Math.min(effectivePage * ITEMS_PER_PAGE, sortedList.length)}
          </span>{' '}
          of <span className={styles.highlight}>{sortedList.length}</span> characters
          {activeQuery ? ` matching "${activeQuery}"` : ''}
        </span>
        <span>
          Page {effectivePage} of {totalPages}
        </span>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className={styles.statusMessage}>
          <div className={styles.loadingSpinner} />
          <p>Loading characters...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.statusMessage}>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && sortedList.length === 0 && (
        <div className={styles.statusMessage}>
          <p>No characters found matching "{activeQuery}".</p>
          <button type="button" onClick={handleClearSearch} className={styles.clearButton}>
            Reset Search
          </button>
        </div>
      )}

      {/* Paginated List Items */}
      {!loading && !error && paginatedList.length > 0 && (
        <div className={styles.listContainer} role="feed" aria-label="Character Search Results">
          {paginatedList.map((character) => (
            <Link
              key={character.id}
              to={`/characters/${character.id}`}
              state={{ characterIds, fromView: 'list' }}
              className={styles.listItem}
              title={`View ${character.name} details`}
            >
              <div className={styles.itemThumbWrapper}>
                <img
                  src={character.image}
                  alt={character.name}
                  className={styles.itemThumb}
                  loading="lazy"
                />
              </div>

              <div className={styles.itemMain}>
                <h2 className={styles.itemName}>{character.name}</h2>
                <div className={styles.itemDetails}>
                  <span>
                    <span className={styles.detailBadge}>Race: </span>
                    <span className={styles.detailValue}>{character.race}</span>
                  </span>
                  <span>
                    <span className={styles.detailBadge}>Gender: </span>
                    <span className={styles.detailValue}>{character.gender}</span>
                  </span>
                  <span>
                    <span className={styles.detailBadge}>Affiliation: </span>
                    <span className={styles.detailValue}>{character.affiliation}</span>
                  </span>
                </div>
              </div>

              <div className={styles.itemKi}>
                <span className={styles.kiLabel}>Base Ki</span>
                <span className={styles.kiAmount}>{character.ki || '0'}</span>
              </div>

              <span className={styles.chevron} aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls (10 items on 1 page) */}
      {!loading && !error && totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Search Results Pagination">
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={effectivePage <= 1}
          >
            ← Previous
          </button>

          <span className={styles.pageInfo}>
            Page {effectivePage} of {totalPages}
          </span>

          <button
            type="button"
            className={styles.pageButton}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={effectivePage >= totalPages}
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
};
