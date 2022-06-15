CREATE TABLE IF NOT EXISTS Requests(
    transaction_id VARCHAR(36) NOT NULL,
    health_authority VARCHAR(128) NOT NULL,
    phones_requested INT NOT NULL,
    creation_date TIMESTAMP NOT NULL,
    PRIMARY KEY(transaction_id)
);