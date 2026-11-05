-- Usuwa talie „Dom i mieszkanie" (dom-pojecia) i „Trening fiszki 4" (trening-fiszki-4).
-- lexicon_entries i postęp użytkowników (po entry_id) kasują się kaskadowo.
delete from lexicon_decks where slug in ('dom-pojecia', 'trening-fiszki-4');
