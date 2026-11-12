import { useState, useEffect, useCallback } from 'react';
import { quests, abilities } from '../data/content';

class PortfolioStore {
  constructor() {
    this.listeners = new Set();
    this.state = {
      selectedQuestId: null,
      hoveredQuestId: null,
      activeTrackFilter: 'ALL',
      activeSkillGroupId: abilities.groups[0]?.id || 'languages',
      hoveredSkillGroupId: null,
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  setSelectedQuestId(id) {
    this.state = { ...this.state, selectedQuestId: id };
    this.notify();
  }

  setHoveredQuestId(id) {
    if (this.state.hoveredQuestId !== id) {
      this.state = { ...this.state, hoveredQuestId: id };
      this.notify();
    }
  }

  setActiveTrackFilter(filter) {
    this.state = { ...this.state, activeTrackFilter: filter };
    this.notify();
  }

  setActiveSkillGroupId(id) {
    this.state = { ...this.state, activeSkillGroupId: id };
    this.notify();
  }

  setHoveredSkillGroupId(id) {
    if (this.state.hoveredSkillGroupId !== id) {
      this.state = { ...this.state, hoveredSkillGroupId: id };
      this.notify();
    }
  }

  nextQuest() {
    if (!this.state.selectedQuestId) return;
    const filtered = this.getFilteredQuests();
    const currentIndex = filtered.findIndex((q) => q.id === this.state.selectedQuestId);
    if (currentIndex >= 0) {
      const nextIndex = (currentIndex + 1) % filtered.length;
      this.setSelectedQuestId(filtered[nextIndex].id);
    }
  }

  prevQuest() {
    if (!this.state.selectedQuestId) return;
    const filtered = this.getFilteredQuests();
    const currentIndex = filtered.findIndex((q) => q.id === this.state.selectedQuestId);
    if (currentIndex >= 0) {
      const prevIndex = (currentIndex - 1 + filtered.length) % filtered.length;
      this.setSelectedQuestId(filtered[prevIndex].id);
    }
  }

  getFilteredQuests() {
    if (this.state.activeTrackFilter === 'ALL') return quests;
    return quests.filter((q) => q.track.includes(this.state.activeTrackFilter));
  }
}

export const portfolioStore = new PortfolioStore();

export function usePortfolioInteraction() {
  const [state, setState] = useState(portfolioStore.state);

  useEffect(() => {
    return portfolioStore.subscribe(setState);
  }, []);

  const setSelectedQuestId = useCallback((id) => portfolioStore.setSelectedQuestId(id), []);
  const setHoveredQuestId = useCallback((id) => portfolioStore.setHoveredQuestId(id), []);
  const setActiveTrackFilter = useCallback((filter) => portfolioStore.setActiveTrackFilter(filter), []);
  const setActiveSkillGroupId = useCallback((id) => portfolioStore.setActiveSkillGroupId(id), []);
  const setHoveredSkillGroupId = useCallback((id) => portfolioStore.setHoveredSkillGroupId(id), []);
  const nextQuest = useCallback(() => portfolioStore.nextQuest(), []);
  const prevQuest = useCallback(() => portfolioStore.prevQuest(), []);

  const selectedQuest = quests.find((q) => q.id === state.selectedQuestId) || null;
  const filteredQuests = portfolioStore.getFilteredQuests();

  return {
    ...state,
    selectedQuest,
    filteredQuests,
    setSelectedQuestId,
    setHoveredQuestId,
    setActiveTrackFilter,
    setActiveSkillGroupId,
    setHoveredSkillGroupId,
    nextQuest,
    prevQuest,
  };
}

