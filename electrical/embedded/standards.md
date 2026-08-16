# Programming Standards

## Project Organization

### Programming Language
Projects should be written in C++.

{% hint style="warning" %}
Projects should **not** be written in pure C.
{% endhint %}

<details>
<summary>Explanation: Why Not Use C?</summary>

The Pico SDK does support developing projects in both C and C++. Additionally, C++ is a superset of C, meaning all C code is generally valid C++ code as well, and that C++ can call C code. However, this also means that C code cannot call C++ code. Additionally, all team libraries are written in C++, which pure C code cannot use.
</details>

### Project Types

#### Libraries
Libraries are collections of code that help serve a specific purpose. Libraries should be reusable across different components and years. Libraries should be named with a simple description of what the library's function is with `lib` added on the to end.

{% hint style="info" %}
##### Example

The library for handling [Controller Area Network](https://www.ni.com/en/shop/seamlessly-connect-to-third-party-devices-and-supervisory-system/controller-area-network--can--overview.html) (CAN) communication is called the `canlib`.
{% endhint %}

#### Components
Components are specific subsystems on a specific design cycle's car. A component should have one Pico dedicated to running its code. Components should be named with a simple description of the component with the competition year of the car that the component is on added on to the end (in kebab case).

{% hint style="info" %}
##### Example

The steering wheel component on the car that competes in 2028 should be called `steering-wheel-2028`.
{% endhint %}

### Project Structure
Projects should follow the following file structure (where a trailing `/` indicates a directory):
```
├── .vscode/
├── inc/
├── lib/
├── src/
├── .gitignore
├── .gitmodules
├── CMakeLists.txt
└── pico_sdk_import.cmake
```
To follow this structure, start **all** projects as a fork of the team project template.

{% hint style="info" %}
#### Directories

##### `inc/`
Directory for all project-level header files.

##### `lib/`
Directory for all libraries obtained from GitHub. All libraries should be added as [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

##### `src/`
Directory for all source files.
{% endhint %}

## Documentation

### Comments
All functions, classes/structs, and enumerations must have documentation comments in the [Doxygen Javadoc](https://www.doxygen.nl/manual/docblocks.html#cppblock) style in the **header** file where they are defined. Use the `@param` tag to document parameters and the `@return` tag to document return values. Do not duplicate documentation comments in source files.

{% hint style="info" %}
##### Example

```cpp
/**
 * A description of what this function does
 *
 * @param x description of what this parameter is
 * @param x description of what this parameter is
 * @return description of what this function returns
 */
int some_function(int x, bool b);

/**
 * A description about this class 
 */
class SomeClass {}
```
{% endhint %}

<details>
<summary>Explanation: Why not document in source files as well?</summary>

Any modern IDE should be able to detect the documentation comment associated with a function being written in a source file, even if it is only located in a header file. Duplicating comments across both header and source files introduces the risk of those two comments becoming inconsistent, which is why documentation comments should only be placed in one file. Header files are the one place to put documentation comments because they are where users of defined elements will look to see declarations and usage information.
</details>

<details>
<summary>Note: Minimize non-documentation comments</summary>

Minimize writing comments that are not documentation comments to explain or otherwise note parts of code as much as possible. If there is a block of code that that feels like it needs a comment explaining what it does to make sense, try to see if you can refactor it to have it make more sense on its own, rather than papering over the messiness with a comment. Of course, if there is something that truly cannot be simplified or refactored yet is still messy enough to warrant commenting, do comment it, but try your best to not write code like that.
</details>

### Project Summary
All projects must have a project summary as their `README.md`. The project summary should be kept up-to-date during the development of the project. Project summaries must include all relevant section described below.

#### Description
Description of what the project is, does, and other relevant summary information.

#### Usage
Information required to deploy and use the project.

#### Project Requirements
Checklist of requirements project must fulfill and if they are currently completed.

#### Hardware
List of all hardware required for the project with links to relevant documentation.

#### Software
List of all external software required for the project with links to relevant documentation.


## Version Control

### Branches
The `main` branch of a project should only contain code that is confirmed to work in real life. Project development should happen on a project's `dev` branch, with all changes being tested in real life before being merged into `main`. Additional branches may be created off `dev` as necessary.

### Commits
All commits should be [atomic](https://www.aleksandrhovhannisyan.com/blog/atomic-git-commits/). Each commit should reflect a logical grouping of changes. Do not group unrelated changes together in a single commit.

## Code Style

#### Headers

##### Inclusion Order
Headers should be included in a file in the following order:

1. Header corresponding to the current file
2. Other project-level headers
3. Third-party library headers
4. Pico SDK headers
5. Standard library headers

Each category of headers must be separtated by an empty line. Headers must be organized alphabetically within each category.'

<details>
<summary>Explanation: Why Include Headers in This Order?</summary>

Including files from most local to least local like this reduces the chance of local project headers accidentally having [hidden depencies](https://stackoverflow.com/a/14243688). Sometimes, code is used in headers without including the proper headers required for it. If users of that header include general headers like standard library headers before including the local header itself, that will still compile despite the local header having a silent undeclared dependency. Including headers from most local to least local ensures that local headers explicitly declare all required dependencies.
</details>

##### Header Guards
Every header must begin with `#pragma once` to prevent multiple inclusion.

<details>
<summary>Explanation: Why Not Use Traditional Header Guards?</summary>

Header guards in C/C++ are traditionally defined like this:

```cpp
#ifndef SOME_NAME_IDK
#define SOME_NAME_IDK

// some declarations here

#endif
```

As an alternative to this, `#pragma once` is a one-line preprocessor directive that achieves the same goal of preventing multiple inclusion. Technically `#pragma once` is not defined in the C++ standard, so it is not an officially supported language feature. However, [virtually every major C/C++ compiler](https://en.wikipedia.org/wiki/Pragma_once#Portability) supports this option and has for decades (GCC has even explicitly [*un*deprecated](https://gcc.gnu.org/gcc-3.4/changes.html) it), so this option is basically standard even if it officially isn't. As for why to use this over traditional header guards, the answer is just that one line at the top of a file is easier to remember to put in than multiple lines at both the beginning and end of a file. A rule that is easier to be followed will be followed more.
</details>

#### Naming

##### Variables and functions
Variable and function names must be in snake case (every word is all lowercase and attached by underscores). Acronyms included in the name should be left as is.

##### Types
Type (`class`, `struct`, `enum`, `typedef`, etc.) names must be in Pascal case (every word is together with no space, all words start with a capital letter). Acronyms included in the name should be left as is.

{% hint style="info" %}
###### Example

```cpp
int variable_in_snake_case = 0;

class TypeNameInPascalCase {}
```
{% endhint %}

#### Macros
Generally avoid the use of macros (except `#include` and conditional compilation) whereever possible. For defining constant expressions use [`constexpr`](https://en.cppreference.com/cpp/language/constexpr). For inlining functions, use [`inline`](https://en.cppreference.com/cpp/language/inline).

<details>
<summary>Explanation: Macros Are Evil</summary>

[C/C++ macros are evil](https://stackoverflow.com/questions/14041453/why-are-preprocessor-macros-evil-and-what-are-the-alternatives) because they avoid type-checking, scope, and basically all other correctness checks for your code. They can also just generally not do what you think they will do. For the vast majority of macro use cases, there is a better way to write them without macros.
</details>

#### Magic Numbers
Do not put magic numbers (number literals with no obvious meaning) in code. Unless the meaning of a number literal is *extremely* obvious, declare it as a meaningful constant before using it.

{% hint style="info" %}
###### Example

```cpp
// what does 0x402 mean???
// 0x402 is a magic number
if (can_id == 0x402) { .... } // don't do this

// oh that's what it means
uint32_t motorVoltageId = 0x402;
if (can_id == motorVoltageId) { .... } // do this
```
{% endhint %}

#### Formatting
TBD