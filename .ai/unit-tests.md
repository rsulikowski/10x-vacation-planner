# High priority

1. useProjectNotes Hook
test scenarios:
- Filter changes trigger query invalidation
- Pagination calculates correct next page
- Handles last page correctly (returns undefined)
- handleFetchNextPage respects hasNextPage and isFetchingNextPage guards
- Notes array correctly flattens across multiple pages

2. usePlan Hook
test scenarios:
- generatePlan rejects when notes array is empty
- fetchPlan handles 404 gracefully (sets plan to null)
- Version increments correctly when regenerating
- Error messages are set and cleared appropriately
- Loading states transition correctly

3. NoteModal Form Validation
test scenarios:
- Content is required (trimmed whitespace)
- Content must not exceed 300 characters
- Priority is required
- Form data transforms correctly to CreateNoteCommand/UpdateNoteCommand
- Tag toggle adds/removes tags correctly
- Selected tags array updates properly

4. FilterControl Debouncing Logic
test scenarios:
- onFilterChange is called only after 500ms of inactivity
- Multiple rapid changes only trigger one callback
- "all" correctly converts to null for priority
- "all" correctly converts to empty string for place_tag
- Cleanup function clears timeout on unmount

5. API Layer (notes.api.ts)
test scenarios:
- fetchNotes constructs URL params correctly
- Handles null/undefined priority gracefully
- Trims and excludes empty place_tag
- Error responses are parsed and thrown correctly
- Handles malformed JSON error responses


# Medium priority

6. InfiniteScrollGrid IntersectionObserver Logic
test scenarios:
- Observer is created when hasNextPage is true
- Observer is NOT created when isFetchingNextPage is true
- onLoadMore is called when sentinel intersects
- Observer disconnects on cleanup
- Handles re-renders correctly

7. ProjectViewContent Event Handlers
test scenarios:
- handleSubmitNote calls updateNote for edit mode
- handleSubmitNote calls createNote for create mode
- Modal closes on success
- handleGeneratePlan switches to plan tab on success
- Error toasts appear on failure