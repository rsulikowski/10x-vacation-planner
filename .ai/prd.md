# Dokument wymagań produktu (PRD) - VacationPlanner

## 1. Przegląd produktu

VacationPlanner to aplikacja webowa umożliwiająca użytkownikom zapisywanie i zarządzanie swobodnymi notatkami o planowanych podróżach, grupowanie ich w projekty podróży oraz generowanie szczegółowych planów wycieczek wykorzystujących AI. Użytkownicy definiują priorytet atrakcji i planowaną datę, a system automatycznie tworzy harmonogram dzienny zgodnie z preferencjami.

## 2. Problem użytkownika

Planowanie angażujących i interesujących wycieczek jest czasochłonne, wymaga wiedzy o miejscach i organizacji czasu. Użytkownicy potrzebują narzędzia, które przekształci luźne notatki o miejscach i czasie w gotowe plany uwzględniające priorytety, liczbę osób i preferencje turystyczne.

## 3. Wymagania funkcjonalne

- Rejestracja i logowanie (email/hasło) z weryfikacją mailową, wygasającymi linkami oraz możliwością resetowania hasła
- Strona profilu z zapisem preferencji turystycznych użytkownika
- CRUD projektów podróży z metadanymi: nazwa, przybliżona długość, planowana data
- CRUD notatek w ramach projektu: treść swobodnego tekstu z tagami miejsca (autouzupełnianie API) i czasu (predefiniowana lista), priorytet atrakcji
- Generowanie planu AI w jednym synchronicznym żądaniu, zwrócenie dziennego harmonogramu
- Wyświetlanie spinnera "Trwa generowanie planu..." oraz obsługa błędów z czytelnym komunikatem i opcją "Spróbuj ponownie"
- Logowanie interakcji z AI w osobnej tabeli (prompt, odpowiedź, status, czas wykonania)

## 4. Granice produktu

- Brak udostępniania planów między kontami
- Brak zaawansowanej obsługi multimediów (np. zdjęć)
- Brak rozbudowanego planowania logistyki i czasu
- Brak panelu administratora w MVP
- Retencja logów AI nie jest wymagana
- Brak monitorowania i alertowania awarii usługi AI
- Brak raportu miesięcznego podsumowującego wygenerowane plany w zakładce "Moje raporty"

## 5. Historyjki użytkowników

- ID: US-001
  Tytuł: Rejestracja konta
  Opis: Jako nowy użytkownik chcę zarejestrować konto podając email i hasło, aby uzyskać dostęp do aplikacji
  Kryteria akceptacji:
  - Formularz wymaga poprawnego formatu email i minimalnej długości hasła
  - Po rejestracji wysyłany jest email weryfikacyjny z linkiem wygasającym
  - Konto pozostaje nieaktywne do momentu weryfikacji

- ID: US-002
  Tytuł: Weryfikacja adresu email
  Opis: Jako użytkownik chcę zweryfikować adres email klikając link, aby aktywować konto
  Kryteria akceptacji:
  - Link weryfikacyjny wygasa po określonym czasie
  - Kliknięcie linku zmienia status konta na aktywne
  - W przypadku błędu wyświetlany jest komunikat

- ID: US-003
  Tytuł: Logowanie do aplikacji
  Opis: Jako użytkownik chcę zalogować się email i hasłem, aby korzystać z aplikacji
  Kryteria akceptacji:
  - Poprawne dane logowania przekierowują do dashboardu
  - Nieudane logowanie wyświetla komunikat o błędnych danych

- ID: US-004
  Tytuł: Reset hasła
  Opis: Jako użytkownik chcę zresetować hasło przez email, aby odzyskać dostęp
  Kryteria akceptacji:
  - Użytkownik podaje email powiązany z kontem
  - Wysyłany jest email z linkiem resetu wygasającym po określonym czasie
  - Po zmianie hasła użytkownik może się zalogować nowymi danymi

- ID: US-005
  Tytuł: Zapis preferencji turystycznych
  Opis: Jako użytkownik chcę zdefiniować preferencje turystyczne w profilu, aby AI uwzględniło je przy generowaniu planu
  Kryteria akceptacji:
  - Możliwość wybrania kategorii preferencji (np. plaża, góry)
  - Preferencje są zapisywane i widoczne w profilu

- ID: US-006
  Tytuł: Tworzenie projektu podróży
  Opis: Jako zalogowany użytkownik chcę utworzyć nowy projekt podróży podając nazwę, przybliżoną długość i datę, aby grupować notatki
  Kryteria akceptacji:
  - Formularz wymaga wszystkich pól
  - Nowy projekt pojawia się w głównym menu

- ID: US-007
  Tytuł: Edycja projektu podróży
  Opis: Jako użytkownik chcę edytować metadane projektu, aby zaktualizować informacje
  Kryteria akceptacji:
  - Możliwość aktualizacji nazwy, długości i daty
  - Zmiany są widoczne w widoku projektu

- ID: US-008
  Tytuł: Usuwanie projektu podróży
  Opis: Jako użytkownik chcę usunąć projekt, aby pozbyć się nieaktualnych planów
  Kryteria akceptacji:
  - Wyświetlane jest potwierdzenie usunięcia
  - Projekt zostaje usunięty z listy

- ID: US-009
  Tytuł: Dodawanie notatki
  Opis: Jako użytkownik chcę dodać notatkę w projekcie z tagami miejsca i czasu, priorytetem i datą, aby zbierać inspiracje
  Kryteria akceptacji:
  - Pola tagów korzystają z autouzupełniania i listy wartości
  - Nowa notatka pojawia się w projekcie

- ID: US-010
  Tytuł: Edycja notatki
  Opis: Jako użytkownik chcę edytować istniejącą notatkę, aby poprawić treść lub tagi
  Kryteria akceptacji:
  - Możliwość zmiany treści, tagów, priorytetu i daty
  - Zmiany są zapisywane

- ID: US-011
  Tytuł: Usuwanie notatki
  Opis: Jako użytkownik chcę usunąć notatkę, aby usunąć niepotrzebne informacje
  Kryteria akceptacji:
  - Wyświetlane jest potwierdzenie usunięcia
  - Notatka zostaje usunięta z listy

- ID: US-012
  Tytuł: Przełączanie między projektami
  Opis: Jako użytkownik chcę przełączać się między projektami z głównego menu, aby zarządzać różnymi podróżami
  Kryteria akceptacji:
  - Lista projektów jest dostępna w menu
  - Wybór projektu ładuje odpowiadające notatki

- ID: US-013
  Tytuł: Generowanie planu wycieczki
  Opis: Jako użytkownik chcę wygenerować plan na podstawie notatek projektu, aby otrzymać szczegółowy harmonogram
  Kryteria akceptacji:
  - API AI zwraca harmonogram w czasie ≤60 s
  - UI pokazuje spinner "Trwa generowanie planu..."
  - W przypadku błędu wyświetlany jest komunikat z opcją "Spróbuj ponownie"

## 6. Metryki sukcesu

- 75% użytkowników generuje co najmniej 3 plany rocznie
- 90% użytkowników wypełnia preferencje turystyczne w profilu
- Czas odpowiedzi AI ≤60 sekund
- Monitorowanie i zapis statusów prób generowania planów
