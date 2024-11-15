import React from 'react'; 
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner'; // Adjust path if necessary


describe('Testing Spinner', () => {
  test('Spinner works as expected', async () => {
    const { rerender } = render(<Spinner on={true} />)
    await screen.findByText('Please wait...')
    rerender(<Spinner on={false} />)
    expect(screen.queryByText('Please wait...')).toBeNull()
  })
  test('sanity', () => {
    expect(true).toBe(true)
 
  })
})
