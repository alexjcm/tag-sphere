# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Implemented delta time logic to make rotational speed consistent across different monitor refresh rates (e.g., 60Hz vs 120Hz).
- Added `IntersectionObserver` to automatically pause the animation loop when the sphere is out of the viewport, significantly reducing CPU usage.

### Changed
- Refactored the render loop to use `transform: translate() scale()` instead of computing `left`, `top`, and `fontSize`. This eliminates layout thrashing and text re-rasterization discrete jumps on low speeds, improving rendering performance.

## [1.0.0] - 2026-04-05

Initial public release.

### Added

- Core `tagSphere` API for Vanilla JS.
- React wrapper entrypoint.
- Astro component entrypoint.
- Optional stylesheet export via `tag-sphere/styles.css` (alias: `tag-sphere/styles`).
- Interactive examples workspace for Vanilla JS, React, and Astro.
