import React from 'react';
import styles from './MobileNav.module.css';

export interface MobileNavProps {
  type: 'nowPlaying' |  'popular' | 'topRated' | 'search';
  onSetType: (type: 'nowPlaying' |  'popular' | 'topRated' | 'search') => void;
  onClose: () => void;
}

const MobileNav = ({
  type,
  onSetType,
  onClose,
}: MobileNavProps): JSX.Element => {
  return (
    <div className={styles.MobileNav}>
      <div className={styles.CloseIcon} onClick={() =>{onClose()}}>x</div>
      <div className={styles.NavItem}
        onClick={() => {onSetType('nowPlaying')}}>
        Now Playing
        {type === 'nowPlaying' && (
          <span>&nbsp;&larr;</span>
        )}
      </div>
      <div className={styles.NavItem}
        onClick={() => {onSetType('popular')}}>
        Popular
        {type === 'popular' && (
          <span>&nbsp;&larr;</span>
        )}
      </div>
      <div className={styles.NavItem}
        onClick={() => {onSetType('topRated')}}>
        Top Rated
        {type === 'topRated' && (
          <span>&nbsp;&larr;</span>
        )}
      </div>
    </div>
  )
};

export default MobileNav;
