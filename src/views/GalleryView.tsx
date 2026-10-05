import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Character, FilterState } from '../types/character';
import { fetchAllCharacters } from '../api/dragonball';
import styles from './GalleryView.module.css';

export const GalleryView: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    gender: 'all',
    race: 'all',
    affiliation: 'all',
  });

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
          setError('Failed to load character gallery.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamically extract unique filter options
  const filterOptions = useMemo(() => {
    const genders = new Set<string>();
    const races = new Set<string>();
    const affiliations = new Set<string>();

    characters.forEach((c) => {
      if (c.gender) genders.add(c.gender);
      if (c.race) races.add(c.race);
      if (c.affiliation) affiliations.add(c.affiliation);
    });

    return {
      genders: Array.from(genders).sort(),
      races: Array.from(races).sort(),
      affiliations: Array.from(affiliations).sort(),
    };
  }, [characters]);

  // Multi-attribute filtering reduction
  const filteredCharacters = useMemo(() => {
    return characters.filter((c) => {
      if (filters.gender !== 'all' && c.gender !== filters.gender) return false;
      if (filters.race !== 'all' && c.race !== filters.race) return false;
      if (filters.affiliation !== 'all' && c.affiliation !== filters.affiliation) return false;
      return true;
    });
  }, [characters, filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      gender: 'all',
      race: 'all',
      affiliation: 'all',
    });
  };

  const isFiltered =
    filters.gender !== 'all' || filters.race !== 'all' || filters.affiliation !== 'all';

  const characterIds = useMemo(
    () => filteredCharacters.map((c) => c.id),
    [filteredCharacters]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Character Gallery</h1>
        <p className={styles.subtitle}>
          Explore the Dragon Ball universe roster and filter characters by attributes
        </p>
      </div>

      {/* 3 Filters at the top of the gallery */}
      <section className={styles.filterBar} aria-label="Gallery Filters">
        <div className={styles.filterGroup}>
          <label htmlFor="gender-filter" className={styles.filterLabel}>
            Gender
          </label>
          <select
            id="gender-filter"
            className={styles.selectInput}
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
          >
            <option value="all">All Genders</option>
            {filterOptions.genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="race-filter" className={styles.filterLabel}>
            Race
          </label>
          <select
            id="race-filter"
            className={styles.selectInput}
            value={filters.race}
            onChange={(e) => handleFilterChange('race', e.target.value)}
          >
            <option value="all">All Races</option>
            {filterOptions.races.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="affiliation-filter" className={styles.filterLabel}>
            Affiliation
          </label>
          <select
            id="affiliation-filter"
            className={styles.selectInput}
            value={filters.affiliation}
            onChange={(e) => handleFilterChange('affiliation', e.target.value)}
          >
            <option value="all">All Affiliations</option>
            {filterOptions.affiliations.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {isFiltered && (
          <div className={styles.filterActions}>
            <button
              type="button"
              className={styles.resetButton}
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Count & Status */}
      <div className={styles.statsBar}>
        <span>
          Showing <span className={styles.countHighlight}>{filteredCharacters.length}</span> of{' '}
          {characters.length} characters
        </span>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className={styles.statusMessage}>
          <div className={styles.loadingSpinner} />
          <p>Loading Dragon Ball characters...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.statusMessage}>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filteredCharacters.length === 0 && (
        <div className={styles.statusMessage}>
          <p>No characters match the selected filters.</p>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleResetFilters}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Media Cards Grid */}
      {!loading && !error && filteredCharacters.length > 0 && (
        <section className={styles.grid} aria-label="Character Media Grid">
          {filteredCharacters.map((character) => (
            <Link
              key={character.id}
              to={`/characters/${character.id}`}
              state={{ characterIds, fromView: 'gallery' }}
              className={styles.card}
              title={`View details for ${character.name}`}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={character.image}
                  alt={character.name}
                  className={styles.thumbnail}
                  loading="lazy"
                />
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.characterName}>{character.name}</h2>
                <div className={styles.tags}>
                  <span className={`${styles.badge} ${styles.badgeRace}`}>
                    {character.race}
                  </span>
                  <span className={styles.badge}>{character.gender}</span>
                  <span className={`${styles.badge} ${styles.badgeAffiliation}`}>
                    {character.affiliation}
                  </span>
                </div>
                <div className={styles.kiRow}>
                  <span>Base Ki</span>
                  <span className={styles.kiValue}>{character.ki || 'Unknown'}</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
};
