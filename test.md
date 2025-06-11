# .gitlab-ci.yml
image: node:18

stages:
  - lint
  - test
  - build

# Cache your node modules and Vite cache to speed up CI runs
cache:
  key: "${CI_COMMIT_REF_SLUG}"
  paths:
    - node_modules/
    - .vite/

before_script:
  # Install fresh dependencies each run
  - echo -e "\n\033[1;33m➤ Installing dependencies...\033[0m"
  - npm ci

lint:
  stage: lint
  script:
    - echo -e "\n\033[1;34m=== 🔍 Linting Source Code ===\033[0m"
    - npm run lint
    - echo -e "\033[1;32m✔ Linting passed!\033[0m"
  allow_failure: false
  artifacts:
    when: always
    reports:
      dotenv: lint-report.env

test:
  stage: test
  script:
    - echo -e "\n\033[1;34m=== 🧪 Running Tests ===\033[0m"
    - npm run test -- --coverage
    - echo -e "\033[1;32m✔ All tests passed!\033[0m"
  artifacts:
    paths:
      - coverage/
    reports:
      junit: jest-results.xml

build:
  stage: build
  script:
    - echo -e "\n\033[1;34m=== 📦 Building Production Bundle ===\033[0m"
    - npm run build
    - echo -e "\033[1;32m✔ Build completed!\033[0m"
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
