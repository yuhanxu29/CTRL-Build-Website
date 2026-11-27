{
  'use strict';

  const faq = document.querySelector('#faq');
  const controls = faq.querySelector('.faq-controls');
  const search = faq.querySelector('#faq-search');
  const category = faq.querySelector('#faq-category');
  const status = faq.querySelector('#faq-status');
  const searchParam = 'faq-q';
  const categoryParam = 'faq-category';
  const groups = Array.from(faq.querySelectorAll('.faq-group'), group => ({
    element: group,
    category: group.dataset.category,
    questions: Array.from(group.querySelectorAll('details'), question => ({
      element: question,
      text: question.textContent.replace(/\s+/g, ' ').toLowerCase(),
    })),
  }));

  function filterQuestions() {
    const query = search.value.trim().toLowerCase();
    const terms = query ? query.split(/\s+/) : [];
    let count = 0;

    for (const group of groups) {
      const matchesCategory = !category.value || category.value === group.category;
      let groupHasMatches = false;

      for (const question of group.questions) {
        const matches = matchesCategory && terms.every(term => question.text.includes(term));
        question.element.hidden = !matches;
        if (matches) {
          groupHasMatches = true;
          count++;
        }
      }

      group.element.hidden = !groupHasMatches;
    }

    const message = count === 0
      ? 'No matching questions. Try another search or category.'
      : `${count} ${count === 1 ? 'question' : 'questions'} found.`;
    if (status.textContent !== message) status.textContent = message;
  }

  function updateFilters() {
    filterQuestions();

    const url = new URL(location.href);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    const query = search.value.trim();
    if (query) url.searchParams.set(searchParam, query);
    else url.searchParams.delete(searchParam);
    if (category.value) url.searchParams.set(categoryParam, category.value);
    else url.searchParams.delete(categoryParam);

    if (url.href !== location.href) history.replaceState(history.state, '', url);
  }

  const params = new URLSearchParams(location.search);
  search.value = params.get(searchParam) ?? '';
  const initialCategory = params.get(categoryParam);
  if (groups.some(group => group.category === initialCategory)) category.value = initialCategory;

  search.addEventListener('input', updateFilters);
  category.addEventListener('change', updateFilters);
  filterQuestions();
  controls.hidden = false;
}
