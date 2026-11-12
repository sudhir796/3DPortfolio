# 3D Models Directory

This directory is reserved for imported 3D models (`.glb` / `.gltf`) to be integrated in future phases.

In **Phase 1 (Scene Foundation)**, all scene geometry (Guild Hall shell, timber beams, quest board, reception desk, magic circle, tavern furniture, lanterns, fireplace, bookshelves, and banners) is procedurally generated from Three.js primitives and code-driven materials.

Each prop in `src/scene/` is designed as an isolated, modular component with standard `position`, `rotation`, and `scale` props so it can be swapped for imported 3D models with minimal changes.
