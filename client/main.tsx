import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { App } from '/imports/ui/App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { EmailVerificationPage } from '/imports/ui/verify-email';
import { ResetPasswordPage } from '/imports/ui/reset-password';

Meteor.startup(() => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />
        },
        {
            path: "verify-email/:token",
            element: <EmailVerificationPage />
        },
        {
            path: "reset-password/:token",
            element: <ResetPasswordPage />
        },
    ])

    const container = document.getElementById('react-target')!;
    const root = createRoot(container);
    root.render(<RouterProvider router={router} />);
});

