import { render, screen } from '@testing-library/react';
import GiftCard from './GiftCard';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('GiftCard', () => {
  it('renders title, canvas, file input, fields, and download button', () => {
    render(<GiftCard />);
    // Judul
    expect(screen.getByText(/Gift Card Generator/i)).toBeInTheDocument();
    // Canvas
    expect(screen.getByTestId('giftcard-canvas')).toBeInTheDocument();
    // File input (label as box)
    expect(screen.getByText(/Browse File/i)).toBeInTheDocument();
    // Input fields
    expect(screen.getByPlaceholderText(/Dear/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Message/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/From/i)).toBeInTheDocument();
    // Download button
    expect(screen.getByRole('button', { name: /Download Gift Card/i })).toBeInTheDocument();
  });

  it('enables download button and triggers download when all fields and image are provided', async () => {
    render(<GiftCard />);
    const dearInput = screen.getAllByPlaceholderText(/Dear/i)[0];
    const messageInput = screen.getAllByPlaceholderText(/Message/i)[0];
    const fromInput = screen.getAllByPlaceholderText(/From/i)[0];
    const fileInput = screen.getAllByLabelText(/Browse File/i)[0];
    const downloadBtn = screen.getAllByRole('button', { name: /Download Gift Card/i })[0];

    // Awal: tombol disabled
    expect(downloadBtn).toBeDisabled();

    // Isi semua field
    await userEvent.type(dearInput, 'John');
    await userEvent.type(messageInput, 'Happy Birthday!');
    await userEvent.type(fromInput, 'Jane');

    // Upload file gambar palsu
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    await userEvent.upload(fileInput, file);

    // Tombol sekarang aktif
    expect(downloadBtn).toBeEnabled();

    // Mock link click
    const createElementSpy = vi.spyOn(document, 'createElement');
    const clickMock = vi.fn();
    createElementSpy.mockReturnValue({ click: clickMock, set download(_) {}, set href(_) {} });

    // Klik tombol download
    await userEvent.click(downloadBtn);
    expect(clickMock).toHaveBeenCalled();
    createElementSpy.mockRestore();
  });
});