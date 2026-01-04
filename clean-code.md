# 📘 Clean Code Requirements

> A comprehensive checklist of coding standards based on *Clean Code* by Robert C. Martin.

---

## 📋 Quick Reference

| Section | Focus Area |
|---------|------------|
| [1. Naming](#1-naming-conventions) | Clear, intentional names |
| [2. Functions](#2-functions) | Small, focused units |
| [3. Comments](#3-comments) | Code explains itself |
| [4. Formatting](#4-formatting) | Visual organization |
| [5. Objects & Data](#5-objects-and-data-structures) | Proper abstraction |
| [6. Error Handling](#6-error-handling) | Exception-based handling |
| [7. Classes](#7-classes) | Single responsibility |
| [8. Heuristics](#8-general-heuristics-smells) | Best practices |

---

## 1. Naming Conventions

### ✅ Requirements

| Requirement | Description | Example |
|-------------|-------------|---------|
| **Reveal Intent** | Names should answer why it exists, what it does, and how it is used | `daysSinceCreation` vs `d` |
| **Avoid Disinformation** | Do not use words with specific programming meanings unless accurate | Don't use `List` unless it's actually a List type |
| **Make Meaningful Distinctions** | Avoid noise words that don't add distinct meaning | ❌ `ProductInfo` vs `ProductData` |
| **Use Pronounceable Names** | Names should be easy to say aloud | `generationTimestamp` vs `genymdhms` |
| **Use Searchable Names** | Avoid single-letter names or magic numbers | Use constants instead of `7` |

### 📝 Specific Rules

- **Classes**: Use noun or noun phrase names (e.g., `Customer`, `Account`). Avoid verbs.
- **Methods**: Use verb or verb phrase names (e.g., `postPayment`, `save`). Accessors should use `get`, `set`, and `is`.
- **Consistency**: Pick one word per concept (e.g., choose `fetch` OR `retrieve` OR `get` — not all three)

---

## 2. Functions

### ✅ Core Requirements

| Requirement | Description |
|-------------|-------------|
| **Small** | Functions should be very small — ideally under 20 lines |
| **Do One Thing** | Functions should do one thing, do it well, and do it only |
| **One Level of Abstraction** | All statements within a function should be at the same level of abstraction |
| **Command Query Separation** | A function should either *do something* (command) OR *answer something* (query), not both |

### ⚠️ Avoid

| Anti-Pattern | Reason |
|--------------|--------|
| **More than 2 arguments** | The ideal is zero (niladic); avoid more than two (dyadic) |
| **Flag arguments** | Passing a boolean is bad practice; split into two functions instead |
| **Side effects** | Functions should not do hidden things (e.g., initializing a session in a password check) |

---

## 3. Comments

### ✅ Allowed Comments

| Type | Description |
|------|-------------|
| **Legal comments** | Copyright, license information |
| **Informative comments** | Explanation of complex patterns (e.g., Regex) |
| **Warning comments** | Alerts about consequences |
| **TODOs** | Tracked tasks for future work |

### ❌ Forbidden Comments

| Type | Why It's Bad |
|------|--------------|
| **Redundant comments** | Comments that just repeat what the code says |
| **Commented-out code** | Delete it — source control remembers |
| **Journal/History comments** | Use source control logs instead |
| **Closing brace markers** | Small functions don't need them |

> **💡 Golden Rule**: If a comment is needed, first try to refactor the code to explain itself. Comments are often a failure to express intent in code.

---

## 4. Formatting

### ✅ Requirements

| Requirement | Description |
|-------------|-------------|
| **Vertical Openness** | Separate concepts (like functions) with blank lines |
| **Vertical Density** | Lines of code that are tightly related should appear vertically close |
| **Indentation** | Hierarchy of scopes should be clearly visible |

---

## 5. Objects and Data Structures

### ✅ Requirements

| Requirement | Description |
|-------------|-------------|
| **Data Abstraction** | Hide implementation details; expose abstract interfaces for data manipulation |
| **Law of Demeter** | A module should not know about the innards of objects it manipulates |

### ❌ Avoid "Train Wrecks"

```
// BAD - violates Law of Demeter
a.getB().getC().doSomething();

// GOOD - tell, don't ask
a.performAction();
```

---

## 6. Error Handling

### ✅ Requirements

| Requirement | Description |
|-------------|-------------|
| **Use Exceptions** | Prefer exceptions over returning error codes |
| **Extract Try/Catch** | Pull try/catch blocks into their own functions to keep logic clean |
| **Single Responsibility** | A function that handles errors should do *nothing else* |

---

## 7. Classes

### ✅ Requirements

| Requirement | Description |
|-------------|-------------|
| **Small** | Classes should be small and have a Single Responsibility (SRP) |
| **High Cohesion** | Methods should manipulate the class's own variables |

> **💡 Single Responsibility Principle**: A class should have one, and only one, reason to change.

---

## 8. General Heuristics (Smells)

### ✅ Best Practices

| Principle | Description |
|-----------|-------------|
| **DRY** | Don't Repeat Yourself — duplication is the root of all evil |
| **Boy Scout Rule** | Leave the code cleaner than you found it |
| **Structure over Convention** | Enforce design decisions structurally rather than relying on conventions |

---

## 📊 Summary Checklist

Use this checklist for code reviews:

- [ ] Names are clear and reveal intent
- [ ] Functions are small and do one thing
- [ ] No unnecessary comments — code is self-explanatory
- [ ] Consistent formatting and indentation
- [ ] Proper abstraction in classes and objects
- [ ] Exceptions used for error handling
- [ ] Classes follow Single Responsibility Principle
- [ ] No code duplication (DRY)
- [ ] Code is cleaner than before (Boy Scout Rule)