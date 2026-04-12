try {
  const d = new Date('invalidT00:00:00');
  console.log('Date:', d);
  console.log('Locale String:', d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
} catch (e) {
  console.error('Caught error:', e);
}
