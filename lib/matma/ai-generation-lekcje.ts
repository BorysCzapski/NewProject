// ============================================================================
// lib/matma/ai-generation-lekcje.ts
// Plain data (NO "server-only"/"use server" marker) so the client trigger
// form can import the lekcja list/count directly for progress labels — same
// reason MATEMAKS_DZIAL_SEEDS was split out of import-curated-matemaks.ts
// into its own marker-free file (see that file's header comment).
//
// Mapped from a matemaks.pl course-index syllabus page ("Kurs do matury
// rozszerzonej") the admin pasted for reference — ONLY the topic titles and
// CKE zagadnienia bullet points were used (that page's actual problem
// content is behind a paywall and was never seen), so lib/matma/generate-
// ai-problems.ts generates entirely fresh, original problems from this
// outline, not reproductions of matemaks' own problems. Lekcja "Prosta i
// parabola" and "Zasada włączeń i wyłączeń" were dropped — the source page
// itself flags both as out of scope for the current CKE formula.
// ============================================================================

export interface AiGenerationLekcja {
  slug: string;
  title: string;
  cke: string;
  /** True when this lekcja is inherently proof-heavy (e.g. "zadania
   * dowodowe") — generate-ai-problems.ts asks for mostly is_proof=true
   * problems for these instead of the usual 2-4/20. */
  proofHeavy?: boolean;
}

export const AI_GENERATION_LEKCJE: AiGenerationLekcja[] = [
  { slug: "liczby-rzeczywiste", title: "Logarytmy", cke: "Wzór na zamianę podstawy logarytmu. Inne wzory związane z logarytmami. Zadania dowodowe z logarytmów." },
  { slug: "liczby-rzeczywiste", title: "Zadania dowodowe (podzielność, potęgi, pierwiastki)", cke: "Dowody dotyczące podzielności liczb całkowitych i reszt z dzielenia. Stosowanie potęg i pierwiastków w zadaniach dowodowych. Wzory skróconego mnożenia w zadaniach dowodowych.", proofHeavy: true },
  { slug: "liczby-rzeczywiste", title: "Wielomiany — wprowadzenie", cke: "Wyłączanie poza nawias jednomianu z sumy algebraicznej. Rozkładanie wielomianu na czynniki (wyłączanie wspólnego czynnika, grupowanie). Rozwiązywanie równań wielomianowych W(x)=0 w postaci iloczynowej. Interpretowanie miejsca zerowego wielomianu." },
  { slug: "liczby-rzeczywiste", title: "Pierwiastki całkowite wielomianu", cke: "Pierwiastki całkowite wielomianu o współczynnikach całkowitych. Dzielenie pisemne wielomianu przez dwumian (x-a). Równanie wielomianowe dwukwadratowe." },
  { slug: "liczby-rzeczywiste", title: "Twierdzenie o reszcie i twierdzenie Bézouta", cke: "Twierdzenie o reszcie z dzielenia wielomianu przez dwumian x-a. Twierdzenie Bézouta." },
  { slug: "liczby-rzeczywiste", title: "Trójkąt Pascala i symbol Newtona", cke: "Własności trójkąta Pascala i symbolu Newtona: C(n,0)=1, C(n,1)=n, C(n,n-1)=n, C(n,k)=C(n,n-k), C(n,k)+C(n,k+1)=C(n+1,k+1). Wzory na a^3+b^3, a^3-b^3, a^n-b^n, (a+b)^n, (a-b)^n." },
  { slug: "rownania-nierownosci", title: "Równania dwukwadratowe", cke: "Równania wielomianowe sprowadzalne do równania kwadratowego, w szczególności dwukwadratowe." },
  { slug: "rownania-nierownosci", title: "Nierówności wielomianowe", cke: "Nierówności wielomianowe W(x)>0, W(x)≥0, W(x)<0, W(x)≤0 dla wielomianów w postaci iloczynowej lub sprowadzalnych do niej metodą wyłączania czynnika lub grupowania." },
  { slug: "rownania-nierownosci", title: "Nierówności wymierne", cke: "Równania i nierówności wymierne sprowadzalne do liniowych/kwadratowych oraz bardziej złożone, sprowadzające się do nierówności wielomianowych." },
  { slug: "rownania-nierownosci", title: "Równania kwadratowe z parametrem i wzory Viète'a", cke: "Wzory Viète'a dla równań kwadratowych. Wyznaczanie parametru m, dla którego rozwiązania równania spełniają określone warunki." },
  { slug: "rownania-nierownosci", title: "Wartość bezwzględna", cke: "Rozwiązywanie równań i nierówności z wartością bezwzględną. Własności wartości bezwzględnej. Zadania dowodowe z wartością bezwzględną.", proofHeavy: true },
  { slug: "rownania-nierownosci", title: "Układy równań", cke: "Układy równań: jedno liniowe + jedno kwadratowe metodą podstawiania; dwa równania kwadratowe postaci x^2+y^2+ax+by=c." },
  { slug: "funkcje", title: "Przekształcenia wykresów funkcji", cke: "Szkicowanie wykresu y=f(x-a), y=f(x)+b, y=-f(x), y=f(-x) na podstawie wykresu y=f(x). Wyznaczanie liczby rozwiązań równania w zależności od parametru." },
  { slug: "funkcje", title: "Funkcja homograficzna", cke: "Przekształcanie wykresu funkcji homograficznej. Badanie monotoniczności, asymptot i osi symetrii hiperboli." },
  { slug: "funkcje", title: "Złożenia funkcji", cke: "Posługiwanie się złożeniami funkcji, wyznaczanie wzoru złożenia, dziedziny złożenia." },
  { slug: "funkcje", title: "Funkcja wykładnicza i logarytmiczna", cke: "Rysowanie i przekształcanie wykresów funkcji wykładniczych i logarytmicznych. Dziedzina funkcji logarytmicznej. Badanie liczby rozwiązań równań z parametrem." },
  { slug: "funkcje", title: "Praktyczne zastosowania funkcji wykładniczej i logarytmicznej", cke: "Zastosowania praktyczne funkcji wykładniczej i logarytmicznej. Typowe zadania z warunkami początkowymi i parametrami." },
  { slug: "ciagi", title: "Ciąg arytmetyczny i geometryczny", cke: "Różne zadania z ciągów, zwłaszcza łączące jednocześnie ciąg arytmetyczny i geometryczny." },
  { slug: "ciagi", title: "Granice ciągów", cke: "Obliczanie granic ciągów korzystając z granic typu 1/n, n-ty pierwiastek z a, twierdzeń o granicach sumy/różnicy/iloczynu/ilorazu ciągów zbieżnych oraz twierdzenia o trzech ciągach." },
  { slug: "ciagi", title: "Szeregi geometryczne", cke: "Badanie zbieżności szeregu geometrycznego i obliczanie jego sumy." },
  { slug: "trygonometria", title: "Trygonometria rozszerzona", cke: "Definicje i wartości sin/cos/tg dowolnego kąta w stopniach i radianach. Zamiana miary łukowej na stopniową i odwrotnie. Wykresy funkcji trygonometrycznych, okresowość, własności. Wzory redukcyjne. Wzory na sumę/różnicę kątów i kąt podwojony. Tożsamości trygonometryczne." },
  { slug: "trygonometria", title: "Równania trygonometryczne", cke: "Rozwiązywanie równań trygonometrycznych. Wzory na sumę/różnicę kątów i kąt podwojony." },
  { slug: "planimetria", title: "Twierdzenie sinusów i cosinusów", cke: "Twierdzenie sinusów i cosinusów. Obliczanie kątów i boków trójkąta (rozwiązywanie trójkątów)." },
  { slug: "planimetria", title: "Podobieństwo figur i twierdzenie Talesa", cke: "Podobieństwo trójkątów. Zależności między obwodami/polami figur podobnych. Twierdzenie Talesa i odwrotne. Własności czworokątów wpisanych/opisanych na okręgu." },
  { slug: "planimetria", title: "Pomysły w geometrii płaskiej", cke: "Czworokąt wpisany/opisany na okręgu, podobieństwa trójkątów, pomocnicze dorysowania — nietypowe podejścia do zadań z geometrii płaskiej rozszerzonej." },
  { slug: "planimetria", title: "Zadania dowodowe z geometrii", cke: "Dowody matematyczne w planimetrii, łączące różne twierdzenia geometrii płaskiej.", proofHeavy: true },
  { slug: "geometria-analityczna", title: "Wektory", cke: "Obliczanie współrzędnych wektora i jego długości. Dodawanie, odejmowanie, porównywanie wektorów. Zastosowania wektorów w geometrii płaskiej." },
  { slug: "geometria-analityczna", title: "Proste, odcinki i okręgi", cke: "Podstawowe pojęcia dot. prostych, odcinków, okręgów. Punkty wspólne prostej i okręgu, dwóch okręgów. Prosta prostopadła/styczna do okręgu. Odległość punktu od prostej. Złożone zadania łączące różne pojęcia geometrii analitycznej." },
  { slug: "stereometria", title: "Proste w przestrzeni", cke: "Twierdzenie o prostej prostopadłej do płaszczyzny i o trzech prostopadłych." },
  { slug: "stereometria", title: "Kąt dwuścienny", cke: "Zaznaczanie i obliczanie kąta między ścianami w graniastosłupach i ostrosłupach." },
  { slug: "stereometria", title: "Przekroje wielościanów", cke: "Wyznaczanie przekrojów sześcianu i ostrosłupów prawidłowych oraz obliczanie ich pól, także z trygonometrią." },
  { slug: "stereometria", title: "Bryły obrotowe", cke: "Obliczanie objętości i pola powierzchni walca, stożka, kuli, także z trygonometrią. Zależność między objętościami brył podobnych." },
  { slug: "kombinatoryka-prawdopodobienstwo", title: "Kombinatoryka", cke: "Reguła mnożenia i dodawania, permutacje, kombinacje, wariacje. Złożone modele zliczania. Współczynnik dwumianowy w kombinatoryce." },
  { slug: "kombinatoryka-prawdopodobienstwo", title: "Prawdopodobieństwo klasyczne", cke: "Prawdopodobieństwo w modelu klasycznym. Zdarzenie przeciwne. Wzór na prawdopodobieństwo sumy zdarzeń." },
  { slug: "kombinatoryka-prawdopodobienstwo", title: "Prawdopodobieństwo warunkowe i całkowite", cke: "Prawdopodobieństwo warunkowe. Prawdopodobieństwo całkowite." },
  { slug: "kombinatoryka-prawdopodobienstwo", title: "Wzór Bayesa", cke: "Wzór Bayesa i jego zastosowania." },
  { slug: "kombinatoryka-prawdopodobienstwo", title: "Schemat Bernoulliego", cke: "Schemat Bernoulliego — prawdopodobieństwo dokładnie k sukcesów w n próbach." },
  { slug: "rachunek-rozniczkowy", title: "Granice funkcji", cke: "Obliczanie granic funkcji, w tym jednostronnych." },
  { slug: "rachunek-rozniczkowy", title: "Własność Darboux", cke: "Stosowanie własności Darboux do uzasadniania istnienia miejsca zerowego funkcji.", proofHeavy: true },
  { slug: "rachunek-rozniczkowy", title: "Obliczanie pochodnej", cke: "Pochodna funkcji potęgowej o wykładniku rzeczywistym. Pochodna sumy, różnicy, iloczynu, ilorazu." },
  { slug: "rachunek-rozniczkowy", title: "Pochodna funkcji złożonej", cke: "Obliczanie pochodnej funkcji złożonej." },
  { slug: "rachunek-rozniczkowy", title: "Interpretacja geometryczna pochodnej", cke: "Definicja pochodnej, interpretacja geometryczna i fizyczna. Styczna do wykresu funkcji." },
  { slug: "rachunek-rozniczkowy", title: "Monotoniczność i ekstrema funkcji", cke: "Stosowanie pochodnej do badania monotoniczności funkcji. Dowodzenie monotoniczności funkcji zadanej wzorem. Wyznaczanie ekstremów funkcji wielomianowych i wymiernych." },
  { slug: "rachunek-rozniczkowy", title: "Zadania optymalizacyjne", cke: "Rozwiązywanie zadań optymalizacyjnych z zastosowaniem pochodnej, z kontekstem praktycznym." },
];

export const AI_GENERATION_PROBLEMS_PER_LEKCJA = 20;
