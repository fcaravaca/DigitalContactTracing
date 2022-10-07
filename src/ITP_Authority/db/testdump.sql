CREATE TABLE IF NOT EXISTS Transactions(
    transaction_id VARCHAR(36) NOT NULL,
    health_authority VARCHAR(128) NOT NULL,
    location_provider VARCHAR(128) NOT NULL,
    transaction_timestamp VARCHAR(128) NOT NULL,
    total_groups INT NOT NULL,
    number_of_infected_groups INT NOT NULL,
    result VARCHAR(256),
    PRIMARY KEY(transaction_id, health_authority, location_provider, transaction_timestamp)
);