import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { appConfig } from './app.config';

describe('app config', () => {
  it('registers core providers', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    TestBed.configureTestingModule({
      providers: [...appConfig.providers, { provide: PLATFORM_ID, useValue: 'server' }]
    });

    expect(appConfig.providers.length).toBeGreaterThan(0);
    expect(TestBed.inject(Router)).toBeTruthy();

    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
