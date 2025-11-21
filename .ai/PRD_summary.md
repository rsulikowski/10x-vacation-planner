<conversation_summary>

<decisions>
1. Notatki wprowadzane jako swobodny tekst z dwoma typami tagów: „miejsce” (autouzupełnianie przez API) i „przybliżony czas” (predefiniowana lista wartości).  
2. Raporty miesięczne dostępne w zakładce „Moje raporty” w aplikacji.  
3. Model notatki zawiera pola: priorytet atrakcji oraz planowana data wyjazdu (miesiąc/pora roku).  
4. Generowanie planu AI odbywa się synchronicznie w jednym żądaniu; UI wyświetla spinner „Trwa generowanie planu…” i po 1 minucie lub w razie błędu pokazuje powiadomienie z opcją „Spróbuj ponownie”.  
5. Retencja logów AI nie jest wymagana w MVP.  
6. W razie błędu AI użytkownik otrzymuje informację o przyczynie niepowodzenia, bez dodatkowych limitacji prób.  
7. Backend hostowany w Supabase (PostgreSQL) na DigitalOcean; CI/CD przez GitHub Actions.  
8. Brak panelu administratora w MVP.  
9. Autoryzacja: email/hasło z weryfikacją mailową, wygasające linki, możliwość ponownej generacji i resetu hasła.  
10. Tech stack: Astro + React + TypeScript + Tailwind CSS + Shadcn/ui; interfejs w języku angielskim.  
11. Użytkownik może tworzyć wiele „projektów podróży” z metadanymi (przybliżona długość i data), i w ramach każdego projektu dodawać, edytować lub usuwać notatki. Projekty widoczne w głównym menu i przełączalne przed generowaniem planu.
</decisions>

<matched_recommendations>

1. Zdefiniowanie słownika tagów i integracja z API autouzupełniania miejsc.
2. Dodanie spinnera i obsługa timeout/error z opcją „Spróbuj ponownie”.
3. Rozbudowa modelu notatki o priorytet i planowaną datę wyjazdu.
4. Logowanie zapytań i odpowiedzi AI w osobnej tabeli.
5. Prostota logowania email/hasło z weryfikacją i obsługą resetu.
6. Wdrożenie HTTPS i przechowywanie sekretów w env vars.
7. Hostowanie backendu na Supabase + DigitalOcean i CI/CD przez GitHub Actions.
8. Ograniczenie interfejsu do jednego języka (angielskiego) na start.
9. Wprowadzenie koncepcji projektów podróży grupujących notatki (nowa rekomendacja wynikająca z doprecyzowania historii).
   </matched_recommendations>

<prd_planning_summary>
a. Główne wymagania funkcjonalne:

- Rejestracja i logowanie: email/hasło, weryfikacja mailowa, wygasające linki, reset hasła.
- Zarządzanie projektami podróży: CRUD projektów z metadanymi (przybliżona długość i data).
- Zarządzanie notatkami w projekcie: CRUD notatek z tagami miejsca i czasu, priorytetem i datą wyjazdu.
- Generowanie planu AI: synchroniczne wywołanie uwzględniające wszystkie notatki projektu, zwracające dzienny harmonogram.
- UI: spinner „Trwa generowanie planu…”, powiadomienia o błędach z opcją „Spróbuj ponownie”.
- Logowanie AI: osobna tabela przechowująca prompt, odpowiedź, status i czas wykonania.

b. Kluczowe historie użytkownika:

1. Tworzę projekt podróży z przybliżoną długością i datą, by grupować notatki.
2. Dodaję w projekcie dowolną liczbę notatek (miejsce lub preferencje czasu), by zebrać inspiracje.
3. Przełączam się między projektami z głównego menu, by edytować lub usuwać notatki.
4. W widoku projektu przeglądam szczegóły (data, długość, notatki) przed generowaniem.
5. Generuję plan: system uwzględnia wszystkie notatki projektu i zwraca harmonogram.
6. Widzę spinner i w razie błędu otrzymuję opis przyczyny z opcją ponowienia.

c. Kryteria sukcesu i metryki:

- 75% użytkowników generuje ≥3 plany rocznie.
- Czas odpowiedzi AI ≤60 s.
- Zapis i monitorowanie statusów prób generowania planów.

d. Obszary wymagające dalszego doprecyzowania:

- Wybór konkretnego API do autouzupełniania miejsc (koszty, limity).
- Lista wartości do tagów czasu i sposób prezentacji.
- Detale harmonogramu generacji i wyzwalania raportów miesięcznych.
  </prd_planning_summary>

<unresolved_issues>

- Dokładna lista wartości tagów czasu i ich UI.
- Mechanizm wysyłki maili weryfikacyjnych i resetu.
- Monitorowanie i alertowanie awarii usługi AI.
- Strategia wersjonowania po MVP.
  </unresolved_issues>

</conversation_summary>
