![Tado Logo](./public/tado_logo_204px.png)

# Tado Frontend

Tado is a platform for collecting feedback from users, employees or other groups of people.
They can use tado to share ideas and suggestions, exchange ideas with each other and further refine them independently.
The aim of tado is to centralize and simplify feedback management for companies.

---

1. [Structure](#structure)
2. [Configuration](#configuration)
3. [Up and Running](#up-and-running)
4. [Authentication & Authorization](#authenticationauthorization)

---

## Structure

Tado's front-end includes a private administration area accessible under `/panel`, while the landingpages to view and
share posts are publicly visible and located as a sub-path of `/board`.

## Configuration

The URL under which the backend server can be reached is `localhost:8080` by default. However the hostname can be
adjusted depending on the local configuration in the .env file.

## Up and Running

### Development

To start the development server on `http://localhost:3000` open a terminal window and navigate to the root directory of
this repository.
Run the following command:

```bash
npm run dev
```

### Production

To Build the application for production open a terminal window and navigate to the root directory of this repository.
Run the following command:

```bash
npm run build
```

## Authentication/Authorization

An administrator with the following credentials has already been created:

```text
email@example.test
$Password
```

This user has two boards with already shared suggestions, which can be accessed under the following URLs:

- [http://localhost:3000/board/5ae5e191-6843-4733-ae5d-a221ffccc6b9](http://localhost:3000/board/5ae5e191-6843-4733-ae5d-a221ffccc6b9)
- [http://localhost:3000/board/d8017955-b744-4653-a249-ad32076ac584](http://localhost:3000/board/d8017955-b744-4653-a249-ad32076ac584)
