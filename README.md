![Tado Logo](./public/tado_logo_204px.png)

# Tado Frontend

Tado is a platform for collecting feedback from users, employees or other groups of people.
They can use tado to share ideas and suggestions, exchange ideas with each other and further refine them independently.
The aim of tado is to centralize and simplify feedback management for companies.

## Structure

Tado's front-end includes a private administration area accessible under `/panel`, while the view for users to view and
share posts is publicly visible and directly localised as a sub-path.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

## Example user

An administrator with the following credentials has already been created:

```text
email@example.test
$Password
```

This user has two boards with already shared suggestions, which can be accessed under the following URLs:

- [http://localhost:8080/5ae5e191-6843-4733-ae5d-a221ffccc6b9](http://localhost:8080/5ae5e191-6843-4733-ae5d-a221ffccc6b9)
- [http://localhost:8080/5ae5e191-6843-4733-ae5d-a221ffccc6b9](http://localhost:8080/5ae5e191-6843-4733-ae5d-a221ffccc6b9)
