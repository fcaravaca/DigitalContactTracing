CREATE TABLE IF NOT EXISTS KeyRegister(
    transaction_id VARCHAR(36) NOT NULL,
    group_id VARCHAR(36) NOT NULL,
    aes_key VARCHAR(64) NOT NULL,
    iv VARCHAR(32) NOT NULL,
    creation_date TIMESTAMP NOT NULL,
    PRIMARY KEY(transaction_id,group_id)
);