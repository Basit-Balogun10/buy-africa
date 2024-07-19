# BuyAfrica

## Introduction

Welcome to BuyAfrica, an AI-Powered Chat-based e-commerce platform designed to support African businesses. Our mission is to encourage the purchase of locally made products by Africans. The platform allows African businesses to sign up and onboard their products, enabling African consumers to easily find and buy these products through an AI-powered chat interface. Additionally, third-party e-commerce platforms can integrate with BuyAfrica to list their products, providing users with a seamless shopping experience that includes both local and third-party products.

## Purpose

BuyAfrica aims to:

- Promote locally made products by providing a platform for African businesses.
- Simplify the shopping experience for African consumers through an AI-powered chat interface.
- Facilitate partnerships with third-party e-commerce platforms, allowing for a wider range of products and a more comprehensive shopping experience.

## Structure

### Folder Structure

Our project is organized as a monorepo, with separate directories for the API and the frontend application. Here's an overview of the major folders:


Sure! Here's the README.md content in markdown format:

markdown
Copy code
# BuyAfrica

## Introduction

Welcome to BuyAfrica, an AI-Powered Chat-based e-commerce platform designed to support African businesses. Our mission is to encourage the purchase of locally made products by Africans. The platform allows African businesses to sign up and onboard their products, enabling African consumers to easily find and buy these products through an AI-powered chat interface. Additionally, third-party e-commerce platforms can integrate with BuyAfrica to list their products, providing users with a seamless shopping experience that includes both local and third-party products.

## Purpose

BuyAfrica aims to:

- Promote locally made products by providing a platform for African businesses.
- Simplify the shopping experience for African consumers through an AI-powered chat interface.
- Facilitate partnerships with third-party e-commerce platforms, allowing for a wider range of products and a more comprehensive shopping experience.

## Structure

### Folder Structure

Our project is organized as a monorepo, with separate directories for the API and the frontend application. Here's an overview of the major folders:

BuyAfrica/
├── api/
│ ├── config/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── templates/
│ ├── types/
│ └── utils/
├── frontend/
│ ├── .github/
│ ├── .vitest/
│ ├── .vscode/
│ ├── public/
│ └── src/
│ ├── assets/
│ ├── components/
│ └── utils/
├── server.ts
└── README.md

### API Folder Structure

- **config/**: Contains configuration files for setting up the environment and application-specific settings.
- **middleware/**: Includes middleware functions that process requests before they reach the route handlers.
- **models/**: Defines the data models and schemas used in the application.
- **routes/**: Houses the route handlers that define the API endpoints.
- **services/**: Contains the business logic and service functions used by the route handlers.
- **templates/**: Stores template files used for rendering dynamic content.
- **types/**: Includes TypeScript type definitions for better type checking and code documentation.
- **utils/**: Utility functions and helpers used throughout the application.

### Frontend Folder Structure

- **.github/**: GitHub configuration files and workflows.
- **.vitest/**: Configuration files for Vitest, the testing framework.
- **.vscode/**: VS Code settings and configuration files.
- **public/**: Static files that are served directly, such as images and the favicon.
- **src/**: Contains the source code for the frontend application.
  - **assets/**: Static assets like images and fonts.
  - **components/**: React components used in the frontend application.
  - **utils/**: Utility functions and helpers used in the frontend code.

At the root of the repository, alongside the `api/` and `frontend/` directories, is the `server.ts` file, which serves as the entry point for the API server.
