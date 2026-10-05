import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import type { Character } from '../types/character';
import { fetchCharacterById, fetchAllCharacters } from '../api/dragonball';
import styles from './DetailsView.module.css';

interface LocationState {
  characterIds?: number[];
  fromView?: 'gallery' | 'list';
}

export const DetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [character, setCharacter] = useState<Character | null>(null);
  const [allIds, setAllIds] = useState<number[]>(() => state?.characterIds || []);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const characterId = id ? parseInt(id, 10) : NaN;

  // Determine active cycling IDs if not passed in navigation state
  useEffect(() => {
    if (allIds.length === 0) {
      let isMounted = true;
      fetchAllCharacters().then((characters) => {
        if (isMounted) {
          setAllIds(characters.map((c) => c.id));
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [allIds.length]);

  // Fetch character details on ID change
  useEffect(() => {
    if (isNaN(characterId)) {
      return;
    }

    let isMounted = true;

    fetchCharacterById(characterId)
      .then((data) => {
        if (isMounted) {
          if (data) {
            setCharacter(data);
            setError(null);
          } else {
            setError('Character not found.');
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError('Failed to fetch character details.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [characterId]);

  // Contextual cycling calculations
  const currentIndex = useMemo(() => {
    if (!character || allIds.length === 0) return -1;
    return allIds.indexOf(character.id);
  }, [character, allIds]);

  const handleCycle = (direction: 'prev' | 'next') => {
    if (allIds.length === 0 || currentIndex === -1) return;

    let targetIndex: number;
    if (direction === 'prev') {
      targetIndex = (currentIndex - 1 + allIds.length) % allIds.length;
    } else {
      targetIndex = (currentIndex + 1) % allIds.length;
    }

    const nextId = allIds[targetIndex];
    navigate(`/characters/${nextId}`, {
      state: { characterIds: allIds, fromView: state?.fromView },
    });
  };

  const backDestination = state?.fromView === 'list' ? '/list' : '/gallery';
  const backLabel = state?.fromView === 'list' ? 'Back to Search & List' : 'Back to Gallery';

  return (
    <div className={styles.container}>
      {/* Top Bar with Back Link and Prev/Next Cycling Controls */}
      <div className={styles.topBar}>
        <Link to={backDestination} className={styles.backLink}>
          ← {backLabel}
        </Link>

        {allIds.length > 1 && (
          <nav className={styles.cycleControls} aria-label="Character Cycling Navigation">
            <button
              type="button"
              className={styles.cycleButton}
              onClick={() => handleCycle('prev')}
              title="Previous character"
            >
              ← Previous
            </button>

            {currentIndex !== -1 && (
              <span className={styles.cycleIndicator}>
                {currentIndex + 1} of {allIds.length}
              </span>
            )}

            <button
              type="button"
              className={styles.cycleButton}
              onClick={() => handleCycle('next')}
              title="Next character"
            >
              Next →
            </button>
          </nav>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className={styles.statusMessage}>
          <div className={styles.loadingSpinner} />
          <p>Loading character details...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.statusMessage}>
          <p>{error}</p>
          <Link to="/gallery" className={styles.backLink}>
            Return to Gallery
          </Link>
        </div>
      )}

      {/* Details Card with Full Character Attributes */}
      {!loading && !error && character && (
        <article className={styles.card} aria-label={`${character.name} Details`}>
          {/* Normal large-sized image */}
          <div className={styles.imageSection}>
            <img
              src={character.image}
              alt={character.name}
              className={styles.heroImage}
            />
          </div>

          {/* Attributes and Information */}
          <div className={styles.infoSection}>
            <div className={styles.infoHead}>
              <span className={styles.idBadge}>Character #{character.id}</span>
              <h1 className={styles.name}>{character.name}</h1>
              <div className={styles.badges}>
                <span className={`${styles.badge} ${styles.badgeRace}`}>
                  Race: {character.race}
                </span>
                <span className={styles.badge}>Gender: {character.gender}</span>
                <span className={`${styles.badge} ${styles.badgeAffiliation}`}>
                  Affiliation: {character.affiliation}
                </span>
              </div>
            </div>

            {/* Power Statistics */}
            <div className={styles.powerBox}>
              <div className={styles.powerItem}>
                <span className={styles.powerLabel}>Base Ki</span>
                <span className={styles.powerValue}>{character.ki || '0'}</span>
              </div>
              <div className={styles.powerItem}>
                <span className={styles.powerLabel}>Max Ki</span>
                <span className={`${styles.powerValue} ${styles.powerValueMax}`}>
                  {character.maxKi || '0'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className={styles.descBlock}>
              <h2 className={styles.sectionHeading}>Biography & Attributes</h2>
              <p className={styles.description}>
                {character.description || 'No description available for this character.'}
              </p>
            </div>
          </div>
        </article>
      )}
    </div>
  );
};
