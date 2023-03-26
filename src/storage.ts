

type ActionType = 'option' | 'content' | 'status' | 'none';
type StatusCode = 'loading' | 'markAsDone' | 'isAvaMarkAsDone' | 'error' | 'stop' | 'ready';

export interface MarkAsDoneModel {
    status: boolean, done: boolean, count: number
}

type Data = {
    status?: { msg: string, code: StatusCode },
    markAsDone?: MarkAsDoneModel
}

export type IStorageRT = {
    context: {
        actionType: ActionType;
        data?: Data
    }

};

const defaultStorageRT: IStorageRT = {
    context: {
        actionType: 'none',
        data: {}
    }

};

export type IStorage = {
    context: {
        isAutoLoginOn: boolean
        userName?: string
        password?: string
    }

};

export const DEFAULT_STORAGE: IStorage = {
    context: {
        isAutoLoginOn: false
    }

};

interface StorageModel {
    get: () => Promise<IStorage>;
    set: (value: IStorage) => Promise<void>;
    addListener: (change: (change: IStorage) => void) => () => void;
}

interface RuntimeModel {
    fromOption: boolean;
    selfParseData?: (dataLocal: IStorageRT) => void,
    send: (value: IStorageRT) => Promise<void>;
    addListener: (change: (change: IStorageRT) => void) => () => void;
}

export const storage: StorageModel = {
    get: (): Promise<IStorage> =>
        chrome.storage.local.get(DEFAULT_STORAGE) as Promise<IStorage>,
    set: (value: IStorage): Promise<void> => chrome.storage.local.set(value),
    addListener: (change: (change: IStorage) => void) => {
        const handleStorageChanges = function (changes, namespace) {
            const m = DEFAULT_STORAGE;
            for (let key in DEFAULT_STORAGE) {
                m[key] = changes[key].newValue;
            }
            change(m);
        };
        chrome.storage.onChanged.addListener(handleStorageChanges);
        // To remove the listener, call removeListener with the same function reference.
        return () => chrome.storage.onChanged.removeListener(handleStorageChanges);
    }
};


export const runtime: RuntimeModel = {
    fromOption: false,
    send: function (value: IStorageRT): Promise<void> {
        if (this.selfParseData) {
            this.selfParseData(value);
        }
        if (this.fromOption) {
            // Get the active tab
            chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
                // Send a message to the content script on the active tab
                await chrome.tabs.sendMessage(tabs[0].id, value);
            });
            return;
        }
        return chrome.runtime.sendMessage(value);
    },
    addListener: (change: (change: IStorageRT) => void) => {
        const handleStorageChanges = function (message: IStorageRT, sender, sendResponse) {
            change(message);
        };
        chrome.runtime.onMessage.addListener(handleStorageChanges);
        // To remove the listener, call removeListener with the same function reference.
        return () => chrome.runtime.onMessage.removeListener(handleStorageChanges);
    }
};

