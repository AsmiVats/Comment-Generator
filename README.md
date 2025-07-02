# Comment Generator

Generate detailed comments for your code effortlessly with the Comment Generator VS Code extension.

[Repository Link](https://github.com/AsmiVats/Comment-Generator)

---

## Features

- **Generate Code Comment**: Automatically generate descriptive comments for your code blocks.
- **Improve Existing Comment**: Enhance and refine your existing code comments for better clarity.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AsmiVats/Comment-Generator.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Comment-Generator
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Compile the extension:
   ```bash
   npm run compile
   ```

## Usage

- Open your project in Visual Studio Code.
- Use the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
- Search for and run:
  - `Generate Code Comment` to create new comments.
  - `Improve Existing Comment` to upgrade your current comments.

## Commands

| Command                                   | Description                     |
|--------------------------------------------|---------------------------------|
| `Generate Code Comment`                    | Generates comments for code     |
| `Improve Existing Comment`                 | Refines and improves comments   |

## Development

- **Build:**  
  ```bash
  npm run compile
  ```
- **Watch:**  
  ```bash
  npm run watch
  ```
- **Lint:**  
  ```bash
  npm run lint
  ```
- **Test:**  
  ```bash
  npm run test
  ```

## Requirements

- Visual Studio Code v1.101.0 or above
- Node.js (compatible with dev dependencies listed in `package.json`)

## Project Structure

- `src/`: Source code of the extension.
- `out/`: Compiled extension files.
- `.vscode/`: VS Code workspace configuration.
- `CHANGELOG.md`: Project changelog.
- `package.json`: Project configuration and scripts.

