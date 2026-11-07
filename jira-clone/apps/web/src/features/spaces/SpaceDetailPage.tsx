import { useEffect, useState } from "react";
import type { FC } from "react";
import { useParams, useNavigate } from "react-router";
import { ProjectHeader } from "../../components/shared/project-header";
import { Board } from "../../components/shared/board";
import {
  CardDetail,
  type CreateCardData,
  type WorkLog,
} from "../../components/shared/card-detail";
import MoveToProjectModal from "../../components/shared/move-to-project-modal/MoveToProjectModal";
import { Button } from "@/components/base";
import {
  type Card,
  type BoardColumn,
  type CardTypeOption,
  type User,
  type Comment,
  type ActivityLog as ActivityLogType,
  DEFAULT_CARD_TYPES,
  updateCardInList,
  moveCardToColumn,
  deleteCardFromList,
  getProjects,
  type ProjectRecord,
  fetchCards,
  createCardFromApi as apiCreateCard,
  updateCard as apiUpdateCard,
  deleteCard as apiDeleteCard,
  updateCardStatus,
  buildUserLookup,
  createWorkLog,
  getHistory,
  getComments,
  createComment,
  deleteComment,
  type UserLookup,
  getStorageItem,
  getWorkLogs,
  createLabel,
  STORAGE_KEYS,
} from "@jira-clone/shared";
import { ROUTES } from "../../routes/paths";
import styles from "./SpaceDetailPage.module.css";

const ArrowLeftIcon: FC<{ size?: number }> = ({
  size = 15,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// Backend card statuses.
const STATUS_COLUMNS: BoardColumn[] = [
  {
    id: "todo",
    title: "To Do",
    order: 0,
    projectId: "",
  },
  {
    id: "in_progress",
    title: "In Progress",
    order: 1,
    projectId: "",
  },
  {
    id: "in_review",
    title: "In Review",
    order: 2,
    projectId: "",
  },
  {
    id: "done",
    title: "Done",
    order: 3,
    projectId: "",
  },
];

export function SpaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] =
    useState<ProjectRecord | null>(null);

  const [users, setUsers] =
    useState<User[]>([]);

  const [userLookup, setUserLookup] =
    useState<UserLookup | null>(null);

  const [cards, setCards] =
    useState<Card[]>([]);

  const [activityLogs, setActivityLogs] =
    useState<ActivityLogType[]>([]);

  const [comments, setComments] =
    useState<Comment[]>([]);

  const [workLogs, setWorkLogs] =
    useState<WorkLog[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [selectedCard, setSelectedCard] =
    useState<Card | null>(null);

  const [isCreateCardOpen, setIsCreateCardOpen] =
    useState(false);

  const [targetColumnId, setTargetColumnId] =
    useState<string | null>(null);

  const [cardTypes] =
    useState<CardTypeOption[]>(
      DEFAULT_CARD_TYPES.slice(0, 3)
    );

  const [movingCard, setMovingCard] =
    useState<Card | null>(null);

  const [isLabelOpen, setIsLabelOpen] =
    useState(false);

  const [selectedLabelCard, setSelectedLabelCard] =
    useState<Card | null>(null);

  const [labelName, setLabelName] =
    useState("");

  const [labelError, setLabelError] =
    useState<string | undefined>();

  const currentUserId =
    userLookup?.currentUserId ?? undefined;

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadSpaceData = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const allProjects =
          await getProjects();

        const rawId =
          decodeURIComponent(id)
            .trim()
            .toLowerCase();

        console.log(
          "Current URL Param:",
          rawId
        );

        console.log(
          "Available Projects:",
          allProjects
        );

        const proj =
          allProjects.find((p) => {
            const matchById =
              String(p.id).toLowerCase() ===
              rawId;

            const matchByKey =
              p.key?.toLowerCase() ===
              rawId;

            return (
              matchById ||
              matchByKey
            );
          });

        if (!proj) {
          console.warn(
            `Project "${rawId}" does not exist in backend. Available keys:`,
            allProjects.map(
              (p) => p.key
            )
          );

          if (!cancelled) {
            const availableKeys =
              allProjects
                .map((p) => p.key)
                .join(", ");

            setLoadError(
              `Project "${id}" was not found. Available projects: ${
                availableKeys || "None"
              }`
            );
          }

          return;
        }

        if (cancelled) return;

        setProject(proj);

        const currentUsername =
          getStorageItem<string>(
            STORAGE_KEYS.CURRENT_USER,
            "web",
            ""
          ) ?? "";

        const lookup =
          await buildUserLookup(
            proj,
            currentUsername
          );

        if (cancelled) return;

        setUserLookup(lookup);
        setUsers(lookup.allUsers);

        const cardList =
          await fetchCards(
            { project: proj.id },
            lookup
          );

        if (cancelled) return;

        setCards(cardList);
      } catch (err: any) {
        console.error(
          "FAILED TO LOAD SPACE:",
          err
        );

        if (!cancelled) {
          setLoadError(
            err?.response?.data?.detail ||
              err?.message ||
              "Failed to load this space. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }

      // History is optional.
      try {
        const historyList =
          await getHistory();

        if (!cancelled) {
          setActivityLogs(
            historyList
          );
        }
      } catch (err) {
        console.error(
          "FAILED TO LOAD HISTORY:",
          err
        );

        if (!cancelled) {
          setActivityLogs([]);
        }
      }

      // Comments are optional.
      try {
        const commentList =
          await getComments();

        if (!cancelled) {
          setComments(commentList);
        }
      } catch (err) {
        console.error(
          "FAILED TO LOAD COMMENTS:",
          err
        );

        if (!cancelled) {
          setComments([]);
        }
      }

      // Work logs are optional.
      try {
        const workLogList =
          await getWorkLogs();

        if (!cancelled) {
          setWorkLogs(
            workLogList
          );
        }
      } catch (err) {
        console.error(
          "FAILED TO LOAD WORK LOGS:",
          err
        );

        if (!cancelled) {
          setWorkLogs([]);
        }
      }
    };

    void loadSpaceData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleBackToSpaces = () =>
    navigate(
      ROUTES.PROTECTED.SPACES
    );

  const handleOpenCreateCard = (
    columnId?: string
  ) => {
    setTargetColumnId(
      columnId || null
    );

    setSelectedCard(null);

    setIsCreateCardOpen(true);
  };

  const handleHeaderCreateCard = () =>
    handleOpenCreateCard();

  const handleCreateCardSubmit = async (
    formData: CreateCardData
  ) => {
    if (
      !project ||
      !userLookup
    ) {
      return;
    }

    const chosenColumnId =
      formData.columnId ||
      targetColumnId ||
      STATUS_COLUMNS[0].id;

    try {
      const newCard =
        await apiCreateCard(
          {
            title: formData.title,
            type: formData.type,
            priority:
              formData.priority ||
              "medium",
            assigneeId:
              formData.assigneeId,
            assigneeIds:
              formData.assigneeIds,
            description:
              formData.description,
            dueDate:
              formData.dueDate,
            projectId:
              String(project.id),
            columnId:
              chosenColumnId,
          },
          userLookup
        );

      setCards((prev) => [
        ...prev,
        newCard,
      ]);

      setIsCreateCardOpen(false);
      setTargetColumnId(null);
      setSelectedCard(newCard);
    } catch (err) {
      console.error(
        "Failed to create card:",
        err
      );
    }
  };

  const handleCardPress = (
    card: Card
  ) => {
    setIsCreateCardOpen(false);
    setSelectedCard(card);
  };

  const handleAddCardPress = (
    columnId?: string
  ) =>
    handleOpenCreateCard(
      columnId
    );

  const handleCardMove = async (
    card: Card,
    toColumnId?: string
  ) => {
    if (
      !toColumnId ||
      !userLookup
    ) {
      return;
    }

    const previous = cards;

    setCards((prev) =>
      moveCardToColumn(
        prev,
        card.id,
        toColumnId
      )
    );

    try {
      const saved =
        await updateCardStatus(
          card.id,
          toColumnId,
          userLookup
        );

      setCards((prev) =>
        updateCardInList(
          prev,
          saved
        )
      );
    } catch (err: any) {
      setCards(previous);

      console.error(
        err.response?.data?.detail ||
          "Failed to move card"
      );
    }
  };

  const handleOpenMoveToProject = (
    card: Card
  ) =>
    setMovingCard(card);

  const handleCardMovedToProject = (
    cardKey: string
  ) => {
    setCards((prev) =>
      prev.filter(
        (card) =>
          card.key !== cardKey
      )
    );

    setSelectedCard(null);
    setMovingCard(null);
  };

  const handleAddLabel = (
    card: Card
  ) => {
    setSelectedLabelCard(card);
    setLabelName("");
    setLabelError(undefined);
    setIsLabelOpen(true);
  };

  const handleCreateLabel = async () => {
    const trimmedLabel =
      labelName.trim();

    if (!trimmedLabel) {
      setLabelError(
        "Label name is required."
      );
      return;
    }

    if (
      !selectedLabelCard ||
      !project ||
      !userLookup
    ) {
      return;
    }

    try {
      // 1. Create the label in the current project.
      console.log("Creating label:", {
        name: trimmedLabel,
        project: project.id,
      });

      const createdLabel =
        await createLabel({
          name: trimmedLabel,
          project: project.id,
        });

      console.log(
        "Label created:",
        createdLabel
      );

      // 2. Add the newly created label to the card.
      const nextLabels = [
        ...(selectedLabelCard.labels ?? []),
        createdLabel.name,
      ];

      console.log(
        "Updating card labels:",
        nextLabels
      );

      const saved =
        await apiUpdateCard(
          selectedLabelCard.id,
          {
            labels: nextLabels,
          },
          userLookup
        );

      console.log(
        "Card updated with label:",
        saved
      );

      // 3. Update the UI with the saved card.
      setCards((prev) =>
        updateCardInList(
          prev,
          saved
        )
      );

      setSelectedCard((prev) =>
        prev &&
        prev.id === saved.id
          ? saved
          : prev
      );

      // 4. Close/reset modal.
      setIsLabelOpen(false);
      setSelectedLabelCard(null);
      setLabelName("");
      setLabelError(undefined);
    } catch (err: any) {
      console.error(
        "LABEL ERROR:",
        err?.response?.data ?? err
      );

      setLabelError(
        err?.response?.data?.detail ||
          err?.response?.data?.name?.[0] ||
          err?.response?.data?.labels?.[0] ||
          "Failed to add label."
      );
    }
  };

  const handleCloseCardDetail = () => {
    setSelectedCard(null);
    setIsCreateCardOpen(false);
    setTargetColumnId(null);
  };

  const handleAddStatus = () => {
    console.warn(
      "Adding custom statuses is not supported by the backend."
    );
  };

  const handleSaveCardDetail =
    async (
      updated: Card
    ) => {
      if (!userLookup) return;

      try {
        const saved =
          await apiUpdateCard(
            updated.id,
            updated,
            userLookup
          );

        setCards((prev) =>
          updateCardInList(
            prev,
            saved
          )
        );

        setSelectedCard(saved);
      } catch (err) {
        console.error(
          "Failed to save card:",
          err
        );
      }
    };

  const handleDeleteCard =
    async (
      cardId: string
    ) => {
      try {
        await apiDeleteCard(
          cardId
        );

        setCards((prev) =>
          deleteCardFromList(
            prev,
            cardId
          )
        );

        setSelectedCard(null);
      } catch (err) {
        console.error(
          "Failed to delete card:",
          err
        );
      }
    };

  // -------------------------
  // COMMENTS
  // -------------------------

  const handleAddComment = async (
    content: string,
    cardId?: string
  ) => {
    const trimmedContent =
      content.trim();

    if (
      !trimmedContent ||
      !cardId
    ) {
      return;
    }

    try {
      const newComment =
        await createComment(
          String(cardId),
          trimmedContent
        );

      const commentToAdd: Comment = {
        ...newComment,
        cardId: String(cardId),
      };

      setComments((prev) => {
        const withoutDuplicate =
          prev.filter(
            (comment) =>
              comment.id !==
              commentToAdd.id
          );

        return [
          ...withoutDuplicate,
          commentToAdd,
        ];
      });

      setSelectedCard((prev) =>
        prev &&
        String(prev.id) ===
          String(cardId)
          ? { ...prev }
          : prev
      );

      try {
        const updatedHistory =
          await getHistory();

        setActivityLogs(
          updatedHistory
        );
      } catch (historyError) {
        console.error(
          "Failed to refresh history after comment:",
          historyError
        );
      }
    } catch (err) {
      console.error(
        "Failed to create comment:",
        err
      );

      throw err;
    }
  };

  const handleDeleteComment =
    async (
      commentId: string
    ) => {
      try {
        await deleteComment(
          String(commentId)
        );

        setComments((prev) =>
          prev.filter(
            (comment) =>
              String(comment.id) !==
              String(commentId)
          )
        );
      } catch (err) {
        console.error(
          "Failed to delete comment:",
          err
        );

        throw err;
      }
    };

  // -------------------------
  // WORK LOG
  // -------------------------

  const handleCreateWorkLog =
    async (
      data: {
        timeSpent: string;
        timeRemaining?: string | null;
        dateStarted: string;
        workDescription?: string;
      }
    ) => {
      if (!selectedCard) {
        return;
      }

      try {
        await createWorkLog(
          selectedCard.key,
          data
        );

        const updatedWorkLogs =
          await getWorkLogs();

        setWorkLogs(
          updatedWorkLogs
        );

        try {
          const updatedHistory =
            await getHistory();

          setActivityLogs(
            updatedHistory
          );
        } catch (
          historyError
        ) {
          console.error(
            "Failed to refresh history after work log:",
            historyError
          );
        }

        console.log(
          "Work log created successfully."
        );
      } catch (err) {
        console.error(
          "Failed to create work log:",
          err
        );

        throw err;
      }
    };

  if (loading) {
    return (
      <div
        className={
          styles.container
        }
      >
        <p>Loading…</p>
      </div>
    );
  }

  if (
    loadError ||
    !project
  ) {
    return (
      <div
        className={
          styles.container
        }
      >
        <p>
          {loadError ??
            "Space not found."}
        </p>

        <Button
          onPress={
            handleBackToSpaces
          }
        >
          Back to Spaces
        </Button>
      </div>
    );
  }

  return (
    <div
      className={
        styles.container
      }
    >
      <div
        className={
          styles.topBar
        }
      >
        <button
          type="button"
          className={
            styles.backButton
          }
          onClick={
            handleBackToSpaces
          }
          aria-label="Back to spaces"
        >
          <ArrowLeftIcon
            size={14}
          />

          <span>
            Back to Spaces
          </span>
        </button>
      </div>

      <section
        className={
          styles.headerSection
        }
      >
        <ProjectHeader
          project={
            project as any
          }
          members={users}
          onCreateCard={
            handleHeaderCreateCard
          }
        />
      </section>

      <section
        className={
          styles.boardSection
        }
      >
        <Board
          columns={
            STATUS_COLUMNS
          }
          cards={cards}
          users={users}
          currentUserId={
            currentUserId
          }
          cardTypes={
            cardTypes
          }
          boardTitle={`${project.name} Sprint Board`}
          projectKey={
            project.key
          }
          onCardPress={
            handleCardPress
          }
          onAddCardPress={
            handleAddCardPress
          }
          onCardMove={
            handleCardMove
          }
          onAddLabel={
            handleAddLabel
          }
          onCreateCard={(
            _title,
            columnId
          ) =>
            handleOpenCreateCard(
              columnId
            )
          }
        />
      </section>

      <CardDetail
        visible={
          Boolean(
            selectedCard
          ) ||
          isCreateCardOpen
        }
        card={
          selectedCard
        }
        isCreating={
          isCreateCardOpen
        }
        targetColumnId={
          targetColumnId
        }
        projectKey={
          project.key
        }
        projectId={String(
          project.id
        )}
        columns={
          STATUS_COLUMNS
        }
        users={users}
        comments={
          comments
        }
        activityLogs={
          activityLogs
        }
        workLogs={
          workLogs
        }
        currentUserId={
          currentUserId
        }
        cardTypes={
          cardTypes
        }
        onAddType={() =>
          console.warn(
            "Custom types are not supported by the backend."
          )
        }
        onClose={
          handleCloseCardDetail
        }
        onCreateCard={
          handleCreateCardSubmit
        }
        onCreateWorkLog={
          handleCreateWorkLog
        }
        onAddComment={
          handleAddComment
        }
        onDeleteComment={
          handleDeleteComment
        }
        onAddStatus={
          handleAddStatus
        }
        onSave={
          handleSaveCardDetail
        }
        onDelete={
          handleDeleteCard
        }
        onMoveToProject={
          handleOpenMoveToProject
        }
        canMoveToProject={
          currentUserId ===
          selectedCard?.assigneeId
        }
      />

      <MoveToProjectModal
        visible={
          Boolean(movingCard)
        }
        card={movingCard}
        currentProjectKey={
          project.key
        }
        onClose={() =>
          setMovingCard(
            null
          )
        }
        onMoved={
          handleCardMovedToProject
        }
      />

      {isLabelOpen && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsLabelOpen(false);
              setSelectedLabelCard(null);
              setLabelName("");
              setLabelError(undefined);
            }
          }}
        >
          <div
            className={styles.modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h2>Add Label</h2>

            <input
              type="text"
              value={labelName}
              autoFocus
              onChange={(e) => {
                setLabelName(
                  e.target.value
                );
                setLabelError(
                  undefined
                );
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  e.preventDefault();
                  console.log(
                    "ENTER PRESSED"
                  );
                  void handleCreateLabel();
                }

                if (
                  e.key === "Escape"
                ) {
                  setIsLabelOpen(false);
                  setSelectedLabelCard(
                    null
                  );
                  setLabelName("");
                  setLabelError(
                    undefined
                  );
                }
              }}
              placeholder="Enter label name"
            />

            {labelError && (
              <p
                className={
                  styles.error
                }
              >
                {labelError}
              </p>
            )}

            <div
              className={
                styles.modalActions
              }
            >
              <button
                type="button"
                onClick={() => {
                  console.log(
                    "CANCEL CLICKED"
                  );

                  setIsLabelOpen(false);
                  setSelectedLabelCard(
                    null
                  );
                  setLabelName("");
                  setLabelError(
                    undefined
                  );
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  console.log(
                    "ADD LABEL BUTTON CLICKED"
                  );
                  void handleCreateLabel();
                }}
              >
                Add Label
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpaceDetailPage;
