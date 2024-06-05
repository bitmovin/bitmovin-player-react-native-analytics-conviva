# Contributing

## Issues

With bugs and problems, please try to describe the issue as detailed as possible to help us reproduce it.

## Pull Request Process

Pull requests are welcome and pair well with bug reports and feature requests. Here are some tips to follow before submitting your first PR:

- Fork the repository to your own account if you haven't already.
- Develop in a fix or feature branch (`fix/describe-your-fix`, `feature/describe-your-feature`), not in `main` or `develop`.
- Please do not introduce new project warnings and adhere to swiftlint styling
- Make your changes in your fork.
- Run tests locally via Xcode.
- Validate your changes with the Convia Touchstone backend.
- Add an entry to the [CHANGELOG.md](CHANGELOG.md) file in the `[Unreleased]` section to describe the changes to the project.
- Submit a pull request to the main repository.

The versioning scheme we use is [SemVer](http://semver.org/).

All additions, modifications and fixes that are submitted will be reviewed. The project owners reserve the right to reject any pull request that does not meet our standards. We may not be able to respond to all pull requests immediately and provide no timeframes to do so.

# Contributing

Thanks for contributing to this project. Your time and input are appreciated. To get the most out of the project, please consider the following.

## Code of Conduct

Please note we have a [Code of Conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Development workflow

To get started with the project, run `yarn bootstrap` in the root directory to install the required dependencies for each package and cocoapods dependencies for the example app:

```sh
yarn bootstrap
```

> While it's possible to use [`npm`](https://github.com/npm/cli), the tooling is built around [`yarn`](https://classic.yarnpkg.com/), so you'll have an easier time if you use `yarn` for development.

While developing, you can run the [example app](/example/) to test your changes. Any changes you make in your library's JavaScript code will be reflected in the example app without a rebuild. If you change any native code, then you'll need to rebuild the example app.

To start the packager, run in the root directory:

```sh
yarn example start
```

To build and run the example app on Android:

```sh
yarn example android
```

To build and run the example app on iOS:

```sh
yarn example ios
```

To edit the Swift/Objective-C files, open `example/ios/BitmovinPlayerReactNativeAnalyticsConvivaExample.xcworkspace` in Xcode and find the source files at `Pods > Development Pods > RNBitmovinPlayer`.

To edit the Kotlin files, open `example/android` in Android Studio and find the source files at `bitmovin-player-react-native` under `Android`.

## For iOS/tvOS on-device development

To build the example project for an iOS or tvOS device, you need to create a file at `example/ios/Developer.xcconfig`. In this file, add your development team like this:

```yml
DEVELOPMENT_TEAM = YOUR_TEAM_ID
```

## TypeScript Code Style

- Follow the `eslint` rules (`yarn lint`). They are enforced automatically via a pre-commit git hook.
- Always add return values to functions (even if `void`)
- No unused imports
- Public functions should be documented with a description that explains _what_ it does
- Every code block that does not obviously explain itself should be commented with an explanation of _why_ and _what_ it does

## Linting

### Typescript

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks verify that the linter will pass when committing.
Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
yarn typescript
yarn lint
```

To fix formatting errors, run the following:

```sh
yarn lint --fix
```

### Kotlin

For Kotlin code [ktlint](https://pinterest.github.io/ktlint/) is used with [ktlint gradle plugin](https://github.com/jlleitschuh/ktlint-gradle).
Run the following inside `android` folder to verify code format:

```sh
./gradlew ktlintCheck
```

To fix formatting errors, run the following inside `android` folder:

```sh
./gradlew ktlintFormat
```

You can add a lint check pre-commit hook by running inside `android` folder:

```sh
./gradlew addKtlintCheckGitPreCommitHook
```

and for automatic pre-commit formatting:

```sh
./gradlew addKtlintFormatGitPreCommitHook
```

### Swift

For Swift code [SwiftLint](https://github.com/realm/SwiftLint) is used.
To install SwiftLint, run `brew bundle install` in the root directory.
Our pre-commit hooks verify that the linter will pass when committing.

To verify Swift code, run the following:

```sh
swiftlint
```

To fix auto-fixable SwiftLint violations, run the following:

```sh
swiftlint lint --autocorrect
```

## Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn bootstrap`: setup the whole project by installing all dependencies and pods.
- `yarn bootstrap:example`: setup example project by installing all dependencies and pods.
- `yarn build`: compile TypeScript files into `lib/` with ESBuild.
- `yarn typescript`: type-check files with TypeScript.
- `yarn lint`: lint files with ESLint.
- `yarn format`: format files with Prettier.
- `yarn brew`: install all dependencies for iOS development with Homebrew.
- `yarn example start`: start the Metro server for the example app.
- `yarn example android`: run the example app on Android.
- `yarn example pods`: install pods only.
