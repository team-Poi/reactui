import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useState } from "react";

import styles from "../styles/components/modal.module.css";

import optCSS from "../utils/onoffCSS";
import classNames from "../utils/classNames";
import Emitter from "../utils/emitter";

import FullFlex from "../components/FullFlex";
import { Saero } from "../components/Column";
import { Garo } from "../components/Row";
import Button from "../components/Button";

import fonts from "../styles/font.module.css";

export interface ConfirmModal {
  title?: string;
  body?: string | React.ReactNode;
  okayButton?: string;
  cancelButton?: string;
  canExit?: boolean;
}
export interface PromptModal {
  title?: string;
  body?: string;
  okayButton?: string;
  canExit?: boolean;
  canBeEmpty?: boolean;
}
export interface DefaultModal {
  renderChildren: (close: () => void) => React.ReactNode;
  canExit?: boolean;
}
export type Modal = ConfirmModal | PromptModal | DefaultModal;
export type ConfirmModalResult = "YES" | "NO" | "EXITED";
export type PromptModalResult = null | string;
export interface ModalState {
  id: string;
  type: "CONFIRM" | "PROMPT" | "LINE" | "DEFAULT";
  modal: Modal;
}
export interface ModalContextData {
  modals: ModalState[];
  modalOpened: boolean;

  addModal: {
    confirm: (modal: ConfirmModal) => Promise<ConfirmModalResult>;
    prompt: (modal: PromptModal) => Promise<PromptModalResult>;
    line: (modal: PromptModal) => Promise<PromptModalResult>;
    modal: (modal: DefaultModal) => void;
  };
}

function emptyPromise<T>() {
  return new Promise<T>((res, rej) => {
    rej(new Error("Not defined"));
  });
}

export const defaultModalState: ModalContextData = {
  modals: [],
  modalOpened: false,
  addModal: {
    confirm: () => emptyPromise<ConfirmModalResult>(),
    prompt: () => emptyPromise<PromptModalResult>(),
    line: () => emptyPromise<PromptModalResult>(),
    modal: () => {
      return {
        close: () => {},
      };
    },
  },
};

// our context
export const ModalContext =
  React.createContext<ModalContextData>(defaultModalState);
export const modalEmitter = new Emitter();

export function RenderConfirmModal({
  modal,
}: {
  modal: {
    modal: ConfirmModal;
    id: string;
  };
}) {
  const [shake, setShaking] = useState(false);
  const lastShake = useRef(new Date().getTime() - 2000);

  const onTryCloseHandler = useCallback(() => {
    if (
      typeof modal === "undefined" ||
      modal.modal.canExit === false ||
      typeof modal.modal.canExit === "undefined"
    ) {
      lastShake.current = new Date().getTime();
      setShaking(true);
      setTimeout(() => {
        let sha = new Date().getTime() - lastShake.current;
        if (sha < 200) return;
        setShaking(false);
      }, 210);
      return;
    }

    modalEmitter.emit(modal.id, "EXITED");
  }, [modal]);

  useEffect(() => {
    modalEmitter.on("TRY.EXIT", onTryCloseHandler);

    return () => {
      modalEmitter.removeListener("TRY.EXIT", onTryCloseHandler);
    };
  }, [onTryCloseHandler]);

  if (!modal) return <></>;
  if (modal.id === "UNDEFINED___") return <></>;

  const cancelButtonClick = () => {
    modalEmitter.emit(modal!.id, "NO");
  };

  const okayButtonClick = () => {
    modalEmitter.emit(modal!.id, "YES");
  };

  return (
    <>
      <div
        className={classNames(styles.modal, styles.sizing, fonts.normal)}
        style={{
          animationName: shake ? styles.shake : "",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Saero className={classNames(styles.modalFlexBody, styles.sizing)}>
          <div className={styles.titleContainer}>
            <div className={classNames(styles.title, fonts.bold)}>
              {modal.modal.title || "Confirm"}
            </div>
          </div>
          <FullFlex
            style={{
              overflow: "hidden",
            }}
          >
            <div className={styles.content}>
              {modal.modal.body || "Are you sure?"}
            </div>
          </FullFlex>
          <Garo
            style={{
              justifyContent: "flex-end",
              padding: "4px",
            }}
            gap={4}
          >
            <Button bordered={true} color="ERROR" onClick={cancelButtonClick}>
              {modal.modal.cancelButton || "Cancel"}
            </Button>
            <Button color="SUCCESS" onClick={okayButtonClick}>
              {modal.modal.okayButton || "Okay"}
            </Button>
          </Garo>
        </Saero>
      </div>
    </>
  );
}

export function RenderPromptModal({
  modal,
}: {
  modal: {
    modal: PromptModal;
    id: string;
  };
}) {
  const [shake, setShaking] = useState(false);
  const [input, setInput] = useState("");
  const lastShake = useRef(new Date().getTime() - 2000);

  const onTryCloseHandler = useCallback(
    (tryFail?: boolean) => {
      if (
        tryFail === true ||
        typeof modal === "undefined" ||
        modal.modal.canExit === false ||
        typeof modal.modal.canExit === "undefined"
      ) {
        lastShake.current = new Date().getTime();
        setShaking(true);
        setTimeout(() => {
          let sha = new Date().getTime() - lastShake.current;
          if (sha < 200) return;
          setShaking(false);
        }, 210);
        return;
      }

      modalEmitter.emit(modal.id, "EXITED");
    },
    [modal]
  );

  useEffect(() => {
    modalEmitter.on("TRY.EXIT", onTryCloseHandler);

    return () => {
      modalEmitter.removeListener("TRY.EXIT", onTryCloseHandler);
    };
  }, [onTryCloseHandler]);

  if (!modal) return <></>;
  if (modal.id === "UNDEFINED___") return <></>;

  const okayButtonClick = () => {
    if (modal.modal.canBeEmpty === false && input === "")
      return onTryCloseHandler(true);
    modalEmitter.emit(modal!.id, input);
  };

  return (
    <>
      <div
        className={classNames(styles.modal, styles.sizing)}
        style={{
          animationName: shake ? styles.shake : "",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Saero className={classNames(styles.modalFlexBody, styles.sizing)}>
          <div className={styles.titleContainer}>
            <div className={classNames(styles.title, fonts.bold)}>
              {modal.modal.title || "Confirm"}
            </div>
          </div>
          <FullFlex
            style={{
              overflow: "hidden",
            }}
          >
            <div
              className={styles.content}
              style={{
                overflowY: "hidden",
                marginBottom: "2px",
              }}
            >
              <Saero
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  flexGrow: "1",
                  overflow: "hidden",
                }}
              >
                <FullFlex
                  style={{
                    overflow: "hidden",
                  }}
                >
                  <textarea
                    placeholder={modal.modal.body || "Input"}
                    className={classNames(styles.textarea, fonts.normal)}
                    value={input}
                    rows={5}
                    onChange={(e) => setInput(e.target.value)}
                  ></textarea>
                </FullFlex>
              </Saero>
            </div>
          </FullFlex>
          <Garo
            style={{
              justifyContent: "flex-end",
              padding: "4px",
            }}
            gap={4}
          >
            <Button bordered={true} color="ERROR" onClick={() => setInput("")}>
              Clear
            </Button>
            <Button color="SUCCESS" onClick={okayButtonClick}>
              {modal.modal.okayButton || "Okay"}
            </Button>
          </Garo>
        </Saero>
      </div>
    </>
  );
}

export function RenderLineModal({
  modal,
}: {
  modal: {
    modal: PromptModal;
    id: string;
  };
}) {
  const [shake, setShaking] = useState(false);
  const [input, setInput] = useState("");
  const lastShake = useRef(new Date().getTime() - 2000);

  const onTryCloseHandler = useCallback(
    (tryFail?: boolean) => {
      if (
        tryFail === true ||
        typeof modal === "undefined" ||
        modal.modal.canExit === false ||
        typeof modal.modal.canExit === "undefined"
      ) {
        lastShake.current = new Date().getTime();
        setShaking(true);
        setTimeout(() => {
          let sha = new Date().getTime() - lastShake.current;
          if (sha < 200) return;
          setShaking(false);
        }, 210);
        return;
      }

      modalEmitter.emit(modal.id, "EXITED");
    },
    [modal]
  );

  useEffect(() => {
    modalEmitter.on("TRY.EXIT", onTryCloseHandler);

    return () => {
      modalEmitter.removeListener("TRY.EXIT", onTryCloseHandler);
    };
  }, [onTryCloseHandler]);

  if (!modal) return <></>;
  if (modal.id === "UNDEFINED___") return <></>;

  const okayButtonClick = () => {
    if (modal.modal.canBeEmpty === false && input === "")
      return onTryCloseHandler(true);
    modalEmitter.emit(modal!.id, input);
  };

  return (
    <>
      <div
        className={classNames(styles.modal, styles.sizing)}
        style={{
          animationName: shake ? styles.shake : "",
          minHeight: "unset",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Saero
          className={classNames(styles.modalFlexBody, styles.sizing)}
          style={{
            minHeight: "unset",
          }}
        >
          <div className={styles.titleContainer}>
            <div className={classNames(styles.title, fonts.bold)}>
              {modal.modal.title || "Confirm"}
            </div>
          </div>
          <FullFlex
            style={{
              overflow: "hidden",
            }}
          >
            <div
              className={styles.content}
              style={{
                overflowY: "hidden",
                marginBottom: "2px",
              }}
            >
              <Saero
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  flexGrow: "1",
                  overflow: "hidden",
                }}
              >
                <FullFlex
                  style={{
                    overflow: "hidden",
                  }}
                >
                  <input
                    placeholder={modal.modal.body || "Input"}
                    className={classNames(
                      styles.textarea,
                      fonts.normal,
                      styles.input
                    )}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  ></input>
                </FullFlex>
              </Saero>
            </div>
          </FullFlex>
          <Garo
            style={{
              justifyContent: "flex-end",
              padding: "4px",
            }}
            gap={4}
          >
            <Button bordered={true} color="ERROR" onClick={() => setInput("")}>
              Clear
            </Button>
            <Button color="SUCCESS" onClick={okayButtonClick}>
              {modal.modal.okayButton || "Okay"}
            </Button>
          </Garo>
        </Saero>
      </div>
    </>
  );
}

export function RednerDefaultModal({
  modal,
}: {
  modal: {
    modal: DefaultModal;
    id: string;
  };
}) {
  const [shake, setShaking] = useState(false);
  const lastShake = useRef(new Date().getTime() - 2000);

  const onTryCloseHandler = useCallback(() => {
    if (modal.modal.canExit === false) {
      lastShake.current = new Date().getTime();
      setShaking(true);
      setTimeout(() => {
        let sha = new Date().getTime() - lastShake.current;
        if (sha < 200) return;
        setShaking(false);
      }, 210);
    }
    modalEmitter.emit(modal.id, "EXITED");
  }, [modal]);

  useEffect(() => {
    modalEmitter.on("TRY.EXIT", onTryCloseHandler);

    return () => {
      modalEmitter.removeListener("TRY.EXIT", onTryCloseHandler);
    };
  }, [onTryCloseHandler]);

  if (!modal) return <></>;
  if (modal.id === "UNDEFINED___") return <></>;

  return (
    <>
      <div
        className={classNames(styles.modal, styles.sizing)}
        style={{
          animationName: shake ? styles.shake : "",
          minHeight: "unset",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {modal.modal.renderChildren(onTryCloseHandler)}
      </div>
    </>
  );
}

export function RenderModal({ modal }: { modal?: ModalState }) {
  if (!modal) return <></>;
  if (modal && modal?.type === "CONFIRM")
    return (
      <RenderConfirmModal
        modal={{
          modal: modal.modal as ConfirmModal,
          id: modal.id,
        }}
      />
    );

  if (modal && modal?.type === "PROMPT")
    return (
      <RenderPromptModal
        modal={{
          modal: modal.modal as PromptModal,
          id: modal.id,
        }}
      />
    );

  if (modal && modal?.type === "LINE")
    return (
      <RenderLineModal
        modal={{
          modal: modal.modal as PromptModal,
          id: modal.id,
        }}
      />
    );

  if (modal && modal?.type === "DEFAULT")
    return (
      <RednerDefaultModal
        modal={{
          modal: modal.modal as DefaultModal,
          id: modal.id,
        }}
      />
    );

  return <></>;
}

export function ModalProvider({ children }: PropsWithChildren) {
  const [modals, setModals] = useState<ModalState[]>(defaultModalState.modals);
  const [modalOpened, setModalOpened] = useState(defaultModalState.modalOpened);
  const onExitTryHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (modals.length === 0) return;
    modalEmitter.emit("TRY.EXIT");
  };
  const addConfirmModal = (modal: ConfirmModal) => {
    let id = Math.random().toString();
    setModals((oldModals) => [
      ...oldModals,
      {
        id: id,
        type: "CONFIRM",
        modal: modal,
      },
    ]);
    setModalOpened(true);
    return new Promise<ConfirmModalResult>((resolve, reject) => {
      modalEmitter.once(id, (data: ConfirmModalResult) => {
        resolve(data);
        setModals((mod_) => {
          let md = [...mod_];
          md.shift();
          if (md.length === 0) setModalOpened(false);
          return md || [];
        });
      });
    });
  };
  const addPromptModal = (modal: PromptModal) => {
    let id = Math.random().toString();
    setModals((oldModals) => [
      ...oldModals,
      {
        id: id,
        type: "PROMPT",
        modal: modal,
      },
    ]);
    setModalOpened(true);
    return new Promise<PromptModalResult>((resolve, reject) => {
      modalEmitter.once(id, (data: PromptModalResult) => {
        resolve(data);
        setModals((mod_) => {
          let md = [...mod_];
          md.shift();
          if (md.length === 0) setModalOpened(false);
          return md || [];
        });
      });
    });
  };
  const addLineModal = (modal: PromptModal) => {
    let id = Math.random().toString();
    setModals((oldModals) => [
      ...oldModals,
      {
        id: id,
        type: "LINE",
        modal: modal,
      },
    ]);
    setModalOpened(true);
    return new Promise<PromptModalResult>((resolve, reject) => {
      modalEmitter.once(id, (data: PromptModalResult) => {
        resolve(data);
        setModals((mod_) => {
          let md = [...mod_];
          md.shift();
          if (md.length === 0) setModalOpened(false);
          return md || [];
        });
      });
    });
  };
  const addDefaultModal = (modal: DefaultModal): void => {
    let id = Math.random().toString();
    setModals((oldModals) => [
      ...oldModals,
      {
        id: id,
        type: "DEFAULT",
        modal: modal,
      },
    ]);
    setModalOpened(true);

    modalEmitter.once(id, () => {
      setModals((mod_) => {
        let md = [...mod_];
        md.shift();
        if (md.length === 0) setModalOpened(false);
        return md || [];
      });
    });
    return;
  };
  return (
    <>
      <ModalContext.Provider
        value={{
          modals,
          modalOpened,
          addModal: {
            confirm: addConfirmModal,
            prompt: addPromptModal,
            line: addLineModal,
            modal: addDefaultModal,
          },
        }}
      >
        <div
          className={[
            styles.background,
            optCSS(modalOpened as boolean, styles.opened),
          ].join(" ")}
          onClick={onExitTryHandler}
        >
          {modalOpened ? <RenderModal modal={modals[0]} /> : null}
        </div>
        {children}
      </ModalContext.Provider>
    </>
  );
}

export function useModal() {
  return React.useContext(ModalContext);
}
