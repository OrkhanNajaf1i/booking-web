import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { queryClient } from '../../shared/lib/react-query/queryClient';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type Props = { children: ReactNode }

export function QueryProvider({children}: Props) {
    return (
        <QueryClientProvider client={queryClient} >
            {children}
            <ReactQueryDevtools initialIsOpen={ false} />
        </QueryClientProvider>
    )
}