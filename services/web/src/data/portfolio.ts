export interface Detail { label: string; value: string }
export interface Role { id: string; date: string; title: string; role: string; bullets: string[] }
export interface Project { id: string; title: string; status: string; summary: string; details: Detail[] }
export interface Portfolio {
  name: string;
  role: string;
  introduction: string;
  coreTools: string;
  email: string;
  linkedin: string;
  roles: Role[];
  projects: Project[];
  supplements: { title: string; details: Detail[] }[];
  publications: { venue: string; title: string; url: string }[];
  education: { date: string; title: string; institution: string; grade: string }[];
  skills: Detail[];
  focus: string;
  interests: string;
}

export const portfolio: Portfolio = {
  "name": "Bhawana Sahu",
  "role": "Software Engineer DevOps",
  "introduction": "I combine software development and DevOps to solve build, test and release challenges for embedded software teams. My work spans CI automation, developer platforms and AI-assisted tools, with a focus on reducing repetitive work and making complex workflows easier to manage.",
  "coreTools": "Core tools Python / Jenkins / Git / Perforce / Linux",
  "email": "mailto:bhawana.sahu.12@gmail.com",
  "linkedin": "https://www.linkedin.com/in/bhawana-sahu/",
  "roles": [
    {
      "id": "role-1",
      "date": "June 2021-present",
      "title": "AMD (contract role)",
      "role": "Software Engineer DevOps",
      "bullets": [
        "Built Git-to-Perforce synchronization and changelist traceability; automated Python-wheel generation and artifact delivery for Linux and Windows.",
        "Migrated Jenkins jobs and implemented targeted reruns for failed or not-run tests, with branch, board and platform selection.",
        "Extended Patchwork with branch-aware lifecycle views, validated metadata editing, search APIs and permission-aware developer actions.",
        "Implemented MCP-compatible API access, per-user token controls and directory-backed profiles; delivered backend and frontend reporting features.",
        "Consolidated CI checks and added validation gates, developer-triggered checks and release-readiness reports.",
        "Created DevX, an AI-assisted development agent designed to help CI developers troubleshoot issues, make code changes and reduce repetitive manual work. Integrated LLM-assisted notifications and AI review; tested developer-assistant features.",
        "Implemented firmware-size comparison and production rejection checks, with Allure diagnostics and branch-specific reporting.",
        "Support releases through patch integration, build triage, changelogs, Doxygen updates, workflow documentation and knowledge transfer."
      ]
    },
    {
      "id": "role-2",
      "date": "2020-2021",
      "title": "Xilinx India Pvt Ltd",
      "role": "Frontend Developer Intern",
      "bullets": [
        "Developed a React reporting application with Django REST APIs.",
        "Worked with HTML/CSS/JavaScript, including performance and accessibility improvements."
      ]
    }
  ],
  "projects": [
    {
      "id": "project-1",
      "title": "Source-control & release automation",
      "status": "Implemented workflows",
      "summary": "Source changes, traceable submissions and cross-platform build artifacts.",
      "details": [
        {
          "label": "Contribution",
          "value": "Built Git-to-Perforce synchronization and changelist updates, scheduled repository synchronization, and Linux/Windows Python-wheel generation and submission. Supported release branches, approved patch integration and documentation delivery."
        },
        {
          "label": "Tools / components",
          "value": "Python, Jenkins, Git, Perforce"
        },
        {
          "label": "Scope",
          "value": "Delivered synchronization and packaging workflows; some SDK packaging remained manual."
        }
      ]
    },
    {
      "id": "project-2",
      "title": "CI orchestration & targeted reruns",
      "status": "Implemented and tested",
      "summary": "Test execution scoped to the failed cases, branch and target platform.",
      "details": [
        {
          "label": "Contribution",
          "value": "Migrated Jenkins jobs and implemented failed/not-run test selection, single-branch reruns and board/platform targeting across component workflows. Updated JSON-based result handling and rerun report integration; contributed parallel-execution prototypes."
        },
        {
          "label": "Tools / components",
          "value": "Python, Jenkins, Allure, JSON test results"
        },
        {
          "label": "Scope",
          "value": "Implemented and tested enhancements to existing component test workflows."
        }
      ]
    },
    {
      "id": "project-3",
      "title": "Patchwork & build-reporting tools",
      "status": "Implemented features; rollout varies",
      "summary": "Patch progress, release status and developer actions in the same workflow.",
      "details": [
        {
          "label": "Contribution",
          "value": "Built configurable lifecycle views, per-branch timelines and PR status displays with compatibility for older records. Added rerun/bypass/reject/revert controls, build-report models and frontend views."
        },
        {
          "label": "Validated updates",
          "value": "Added JSON validation before database writes, branch-aware metadata editing, selectable Jira comment targets and UI/server restrictions for sensitive actions."
        },
        {
          "label": "APIs and access",
          "value": "Implemented a changelist/issue search API and MCP-compatible routes for patch actions, CI checks and saved filters. Built per-user token creation, expiry and revocation controls."
        },
        {
          "label": "Identity and reliability",
          "value": "Added directory-backed profiles and corrected manager-contact mapping during patch ingestion. Separated email-notification failures from successfully completed reverts."
        },
        {
          "label": "Tools / components",
          "value": "Python, Django, PostgreSQL, HTML/CSS/JavaScript, MCP-compatible APIs, LDAP integration"
        },
        {
          "label": "Scope",
          "value": "Contributions to a shared portal. Rollout varies by feature; token-management database migration validation remains outstanding."
        }
      ]
    },
    {
      "id": "project-4",
      "title": "CI quality gates & release reporting",
      "status": "Implemented checks",
      "summary": "Actionable validation results before integration and release.",
      "details": [
        {
          "label": "Contribution",
          "value": "Consolidated CI checks and added developer-triggered checks, compiler-warning rejection, copyright warnings, restricted-keyword validation and Linux checkpatch integration. Developed issue-grouped regression and approval-status views; maintained release checklists, changelogs, Doxygen and regression comparison reports."
        },
        {
          "label": "Tools / components",
          "value": "Python, Jenkins, Patchwork, checkpatch, Doxygen"
        },
        {
          "label": "Scope",
          "value": "Copyright and documentation-compliance checks provide warnings. Approval-status views support reporting, not release enforcement; additional documentation integration remains unverified at runtime."
        }
      ]
    },
    {
      "id": "project-5",
      "title": "AI-assisted CI analysis & developer tooling",
      "status": "Integrated analysis; source-reviewed extensions",
      "summary": "Failure analysis and code review connected to CI evidence.",
      "details": [
        {
          "label": "Contribution",
          "value": "Extended LLM-assisted Allure analysis notifications across smoke/system tests and integrated AI review into developer-run CI checks."
        },
        {
          "label": "Patchwork integration",
          "value": "Added embedded chat attachment and voice-input controls, on-demand patch-status summaries and stage-linked failure tickets. Worked on model-gateway integration and response/error handling."
        },
        {
          "label": "Diagnostic context",
          "value": "Contributed read-only diagnostic integration combining current patch status, Allure failures, retry history, compiler errors and Jenkins log excerpts, with structured chart delivery."
        },
        {
          "label": "Tools / components",
          "value": "Allure, Python, Jenkins, Patchwork, JavaScript"
        },
        {
          "label": "Scope",
          "value": "Notification and review integrations are implemented. Additional interface and gateway extensions remain independently unverified at runtime; an earlier notification redesign remains a proof of concept."
        }
      ]
    },
    {
      "id": "project-6",
      "title": "Repository-aware CI developer assistant",
      "status": "Implemented; rollout unverified",
      "summary": "CI workflow knowledge connected to source code and developer change workflows.",
      "details": [
        {
          "label": "Contribution",
          "value": "Built DevX, a FastAPI assistant combining CI workflow documentation with bounded source search, read-only Q&A and a tool-using agent mode."
        },
        {
          "label": "Change workflow",
          "value": "Implemented staged file proposals, list/apply/discard operations and pull-request tooling with checks for unrelated working-tree changes."
        },
        {
          "label": "Model integration",
          "value": "Added model discovery, tool/image capability checks and request/response normalization across multiple model API protocols, with catalogue caching and failure handling."
        },
        {
          "label": "Tools / components",
          "value": "Python, FastAPI, Uvicorn, Git, model API integration"
        },
        {
          "label": "Scope",
          "value": "Earlier testing covers selected assistant features, not every current gateway or pull-request workflow. Production rollout and current pull-request execution remain unverified."
        }
      ]
    },
    {
      "id": "project-7",
      "title": "Firmware build-size gates & diagnostics",
      "status": "Production checks; dashboard enhancements",
      "summary": "Size comparisons and diagnostic reports connected to integration checks.",
      "details": [
        {
          "label": "Contribution",
          "value": "Built patched/unpatched size-comparison workflows, followed by production rejection checks and linked Allure diagnostics. Displayed branch-specific size results in Patchwork and added job-wait coordination for smoke and integration workflows."
        },
        {
          "label": "Size-analysis dashboard",
          "value": "Added filtering, sorting and pagination, report-link availability checks, and compact per-board comparisons with diagnostic details."
        },
        {
          "label": "Tools / components",
          "value": "Build automation, Jenkins, Allure, Patchwork"
        },
        {
          "label": "Scope",
          "value": "Specific rejection checks and report integration reached production; rollout of additional dashboard enhancements varies."
        }
      ]
    }
  ],
  "supplements": [
    {
      "title": "Further development",
      "details": [
        {
          "label": "AI usage visibility",
          "value": "Ongoing enhancements for token usage and configurable cost tracking in CI conversations."
        },
        {
          "label": "Multi-repository tracking enhancements",
          "value": "Additional patch/commit tracking with dry runs, database association, issue updates, notifications and scheduling."
        },
        {
          "label": "Legacy Patchwork modernization",
          "value": "Porting custom features to a current Python 3-based stack; database configuration and migration validation remain in progress."
        }
      ]
    },
    {
      "title": "Academic projects",
      "details": [
        {
          "label": "Genetically optimized neural networks",
          "value": "Breast cancer detection and feature selection, with related published research."
        },
        {
          "label": "NDVI comparison",
          "value": "Comparison of Landsat 8 and Sentinel 2 imagery."
        },
        {
          "label": "Health Assured",
          "value": "Academic mobile application using Firebase."
        },
        {
          "label": "PG accommodation portal",
          "value": "Academic accommodation project using PHP/MySQL."
        }
      ]
    }
  ],
  "publications": [
    {
      "venue": "Wiley",
      "title": "A Comparative Study of Different Classifiers to Propose a GONN for Breast Cancer Detection",
      "url": "https://doi.org/10.1002/9781119786122.ch8"
    },
    {
      "venue": "FICTA 2020, Springer",
      "title": "A comparative Analysis of different Classifiers and proposed genetically optimised neural network",
      "url": "https://doi.org/10.1007/978-981-15-5788-0_61"
    }
  ],
  "education": [
    {
      "date": "2019-2021",
      "title": "MTech, Computer Science and Engineering",
      "institution": "VIT Vellore",
      "grade": "CGPA 8.32"
    },
    {
      "date": "2014-2018",
      "title": "BE, Information Technology",
      "institution": "BIT Durg",
      "grade": "CGPA 7.82"
    }
  ],
  "skills": [
    {
      "label": "Languages",
      "value": "Python, HTML/CSS/JavaScript"
    },
    {
      "label": "AI application services",
      "value": "FastAPI, Uvicorn, multi-model API integration"
    },
    {
      "label": "Web development",
      "value": "React, Django REST, Django"
    },
    {
      "label": "Databases",
      "value": "PostgreSQL, MySQL, Oracle"
    },
    {
      "label": "Operating systems",
      "value": "Linux, Windows"
    },
    {
      "label": "CI and containers",
      "value": "Jenkins, Docker"
    },
    {
      "label": "Versioning and artifacts",
      "value": "Git, Perforce, Artifactory"
    },
    {
      "label": "Reporting and collaboration",
      "value": "Allure, Patchwork, Jira, Slack"
    },
    {
      "label": "Code and documentation checks",
      "value": "checkpatch, Doxygen"
    },
    {
      "label": "Application integrations",
      "value": "MCP-compatible APIs, LDAP integration"
    }
  ],
  "focus": "Practical focus Test orchestration, source-control synchronization, release/artifact workflows, CI quality gates and source-grounded developer tooling.",
  "interests": "Cooking / Reading / Painting / Travel"
};