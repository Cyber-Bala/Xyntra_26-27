# React + Vite

## Local backend integration

Copy `.env.example` to `.env` before running Vite. Start the Django API at
`http://localhost:8000` with `DEBUG=True` and `FRONTEND_URL=http://localhost:5173`.
The first registration stage posts the team roster and PPT to `/api/register/`.
After email verification and organizer selection, the backend sends the team
leader a private `/payment/<token>/` link for the Round 2 Razorpay checkout.
Set `VITE_API_BASE_URL` to the deployed API URL when building for production.

Activate the backend environment from the `Backend` directory with
`.venv\Scripts\Activate.ps1`, then run `python manage.py runserver`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
