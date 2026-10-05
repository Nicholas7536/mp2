# LLM Conversation Log: CS409 MP2 - Front-end App

- **Date Started**: 2026-10-04
- **LLM / Tool**: Google Antigravity (Gemini 3.8 Flash)
- **Course**: CS409 - Web Programming (UIUC)
- **Repository**: [mp2](https://github.com/Nicholas7536/mp2)

---

## Turn 1: Initialization & Logging Protocol Setup

### User Prompt:
```
For the future of this chat including this query. Record it in the llm logs folder.
```

### Assistant Response:
- Identified assignment requirements in `README.md` and confirmed the course LLM Usage Policy.
- Initialized `conversation_log.md` inside `llmLogs/` to log this query and all subsequent interactions.
- Committed to appending and updating conversation records, plans, and walkthrough logs across future turns.
- Ready for user instructions on API selection, architecture, or project setup for MP2.

---

## Turn 2: Planning & Specification for Dragon Ball Explorer

### User Prompt:
```
/plan The API I will use is this: https://dragonball-api.com/api-docs . It is a dragonball api, and in this case I will only be designing the webapp based off the characters query. The search query aspect will only be by name and limit 10 on 1 page.  search query if 200 will return list of candidates for the search, then a user can click on a character in the list to open said character in the details view. next as for the gallery view it will show all characters in the api and at the top of the galery there will be 3 filters to reduce the characters. Filters are gender, race, affiliation as per the api. on clicking on a character in the gallery view it will open a detail view.
In this detail view all attributes of character will be displayed as well.

images included in the character api will be small for gallery and search list components, but larger normal size in the detail view.  each should be its own react route and use typescript instead of javascript.

use normalizecss components and dont inline/create css slop, just use components already available on normalize.css
```

### Assistant Response:
- Researched Dragon Ball API endpoints (`/characters`, `/characters?name=`, `/characters/:id`).
- Verified all grading rubric criteria and rules from `README.md` (List View, Gallery View, Details View with Prev/Next buttons, React Router, Axios, TypeScript, Normalize.css, CSS Modules, zero inline styles, zero layout tables, GitHub Pages deploy config with `base: '/mp2/'`).
- Created detailed `implementation_plan.md` artifact covering architecture, data layer, component breakdown, styling strategy, and verification plan.
- Requested user feedback/approval on the implementation plan before initiating scaffolding and code generation.

---

## Turn 3: Plan Refinement & Grilling Phase

### User Prompt:
```
no. do not include planets and transformations. only characters will be used for the search and gallery query results.
then /grill-me for what is next
```

### Assistant Response:
- Updated `implementation_plan.md` to remove `originPlanet` and `transformations`, strictly scoping all data models and views to character attributes (`id`, `name`, `ki`, `maxKi`, `race`, `gender`, `description`, `image`, `affiliation`).
- Initiated `/grill-me` interactive question session to resolve remaining user preferences regarding:
  1. Default landing view (`/list` vs `/gallery`).
  2. Sorting properties for the List View (Name, Ki, ID).
  3. Previous/Next cycling sequence behavior in Details View.
  4. Search bar implementation strategy (instant client-side filtering vs direct API requests).

---

## Turn 4: Grilling Session & Plan Lock-in

### User Responses to Grilling Interview:
1. **Default Landing View**: Gallery View (`/gallery`).
2. **List Sorting Attributes**: Name (alphabetical) and Base Ki / Power Level with Ascending / Descending toggles.
3. **Details Prev/Next Cycling**: Contextual cycling based on the active filtered/sorted list from whichever view (List or Gallery) the user navigated from (with full roster fallback for direct URL access).
4. **Search Filtering Behavior**: Client-side filtering once the user presses **Enter** (not on every keystroke), displaying 10 results per page with pagination.
5. **Entity Scope**: Strictly characters only (excluding planets and transformations).

### Assistant Actions:
- Updated `implementation_plan.md` to incorporate all 5 finalized architectural and UX decisions.
- Ready to proceed with project scaffolding (Vite + React + TS), preserving `README.md` and repository deploy workflows.

---

## Turn 5: Implementation Testing via Chrome DevTools MCP

### User Prompt:
```
finally test this implementation plan using chrome devtools for agents MCP server. @mcp:chrome-devtools-mcp: and remember to record chat in conversation log in llmLogs dir.
```

### Testing Procedure & Results:
1. **Linter & Build Verification**:
   - `npm run lint` (`oxlint`): 0 warnings, 0 errors across all 10 project files.
   - `npm run build` (`tsc -b && vite build`): Successfully generated production bundles (`dist/`).
2. **Server Launch**:
   - Started Vite dev server at `http://localhost:5173/mp2/` in background.
3. **Automated Browser Testing (`chrome-devtools-mcp`)**:
   - **Root Route Redirection**:
     - Navigated to `http://localhost:5173/mp2/` -> automatically redirected to `/gallery` default landing view.
   - **Gallery View (`/gallery`)**:
     - Loaded full 58-character roster.
     - Verified 3 dynamic filter dropdowns (Gender, Race, Affiliation).
     - Filtered by `Gender: Female` -> roster reduced to 7 matching characters with "Reset Filters" button dynamically displayed.
     - Inspected console messages via `list_console_messages` -> 0 runtime errors.
   - **Details View Navigation & Contextual Cycling (`/characters/:id`)**:
     - Clicked on Bulma card from filtered gallery -> loaded `http://localhost:5173/mp2/characters/4`.
     - Verified full character attribute display: normal large-sized hero image, Character #4, Name, Race (Human), Gender (Female), Affiliation (Z Fighter), Base Ki (0), Max Ki (0), and full biography.
     - Verified contextual cycling indicator showed "1 of 7" (respecting the 7 female characters from gallery filter).
     - Cycled `Next →` -> loaded Chi-Chi (`/characters/14`, "2 of 7").
     - Cycled `Next →` -> loaded Launch (`/characters/19`, "3 of 7").
     - Cycled `← Previous` -> returned to Chi-Chi ("2 of 7").
     - Clicked `← Back to Gallery` -> cleanly returned to gallery view.
   - **Search & List View (`/list`)**:
     - Clicked navigation link to `/list`.
     - Verified 10-item pagination ("Showing 1–10 of 58 characters", "Page 1 of 6").
     - Tested alphabetical Name sorting (Ascending).
     - Tested Base Ki sorting (Ascending: 0 power levels like Bulma, Chi-Chi; Descending: top tiers like Zeno 500 Septillion, Vermoudh 9.9 Septillion, Whis 15 Septillion).
     - Tested pagination control `Next →` -> loaded Page 2 ("Showing 11–20 of 58 characters").
     - Tested search input with query `"Goku"` and submit -> reduced to 1 candidate ("Showing 1–1 of 1 characters matching 'Goku'").
     - Clicked Goku item -> navigated to `http://localhost:5173/mp2/characters/1` with `← Back to Search & List` context link.
   - **Direct URL Access & Fallback**:
     - Navigated directly to `http://localhost:5173/mp2/characters/2` (Vegeta) without state.
     - Successfully loaded Vegeta with full 58-character fallback sequence ("2 of 58").
     - Verified 0 console exceptions across all test runs.

---

## Turn 6: Grader Evaluation (README.md Rubric)

### User Prompt:
```
Now @mcp:chrome-devtools-mcp: pretend youre a grader. evaluate the app in its current state using grading criteria in readme.md file. do not include deployment rubric in this evaluation
```

### Grader Evaluation Report:
- **Total Points Assessed**: 100 / 100 points
- **Rubric Breakdown**:
  1. **List View (28 / 28 pts)**:
     - Displays relevant items from chosen API: 4/4
     - Search bar filters down items based on search: 8/8
     - Sort by at least 2 properties (Name & Base Ki): 8/8
     - Sort in Ascending and Descending order: 8/8
  2. **Gallery View (12 / 12 pts)**:
     - Composed of item media: 4/4
     - Clicking on filter changes results accordingly: 8/8
  3. **Details View (38 / 38 pts)**:
     - Clicking item in List View takes to Details View: 10/10
     - Clicking item in Gallery View takes to Details View: 10/10
     - Details View contains full item attributes: 8/8
     - PREVIOUS and NEXT cycling buttons work correctly: 10/10
  4. **Other (22 / 22 pts)**:
     - Uses React Router and TypeScript: 12/12
     - Design (Normalize.css, CSS modules, responsive, no inline styles, no layout tables): 10/10
- **Course Rules Verification**:
  - Rule 3 (Zero inline styles): PASSED (0 occurrences in `src/`)
  - Rule 4 (Zero inline scripts): PASSED (0 occurrences in `src/`)
  - Rule 5 (Zero HTML tables for layout): PASSED (0 occurrences in `src/`)

---
