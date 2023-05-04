-- User table
CREATE TABLE IF NOT EXISTS `user` (
    `usr_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `usr_username` VARCHAR(30) NOT NULL,
    `usr_password` VARCHAR(100)  NOT NULL,
    `usr_firstname` VARCHAR(30) NOT NULL,
    `usr_lastname` VARCHAR(30) NOT NULL,
    `usr_email` VARCHAR(50) NOT NULL,
    `usr_salt` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`usr_id`) 
) DEFAULT CHARSET=utf8;

-- Caretaker table
CREATE TABLE IF NOT EXISTS `caretaker` (
    `ct_usr_id` INT UNSIGNED NOT NULL,
    `ct_usr_id_care` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`ct_usr_id`, `ct_usr_id_care`),
    FOREIGN KEY (`ct_usr_id`) REFERENCES `user` (`usr_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (`ct_usr_id_care`) REFERENCES `user` (`usr_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) DEFAULT CHARSET=utf8;

-- Medicine table
CREATE TABLE IF NOT EXISTS `medicine` (
    `med_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `med_name` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`med_id`)
) DEFAULT CHARSET=utf8;

-- Prescription table
CREATE TABLE IF NOT EXISTS `prescription` (
    `pre_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `pre_usr_id` INT UNSIGNED NOT NULL,
    `pre_med_id` INT UNSIGNED NOT NULL,
    `pre_dosage` VARCHAR(50) NOT NULL,
    `pre_frequency` INT NOT NULL,
    `pre_instructions` VARCHAR(500) NOT NULL,
    `pre_start_date` DATETIME NOT NULL,
    `pre_end_date` DATETIME NOT NULL,
    `pre_last_dose` DATETIME NOT NULL DEFAULT(CURRENT_TIMESTAMP),
    `pre_description` VARCHAR(500) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT 1,
    PRIMARY KEY (`pre_id`),
    FOREIGN KEY (`pre_usr_id`) REFERENCES `user` (`usr_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (`pre_med_id`) REFERENCES `medicine` (`med_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) DEFAULT CHARSET=utf8;

-- URL for push notifications to be sent to
CREATE TABLE IF NOT EXISTS `user_subscriptions` (
    `us_usr_id` INT UNSIGNED NOT NULL,
    `us_sub` TEXT NOT NULL,
    PRIMARY KEY (`us_usr_id`),
    FOREIGN KEY (`us_usr_id`) REFERENCES `user` (`usr_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) DEFAULT CHARSET=utf8;

-- Insert some default data
INSERT INTO `medicine` (`med_name`) VALUES ('Acetaminophen'),('Advil'), ('Aleve'), ('Alprazolam'), ('Altoprev'), ('Aspirin'), 
('Atorvastatin'), ('Buprenorphine'), ('Caffeine'), ('Carisoprodol'), ('Cetirizine'), ('Chlordiazepoxide'), ('Clonazepam'), 
('Codeine'), ('Crestor'), ('Diazepam'), ('Diphenhydramine'), ('Diphenhydramine'), ('Doxylamine'), ('Euthyrox'), ('Farxiga'), 
('Fentanyl'), ('Fexofenadine'), ('Fluvastatin'), ('Fortamet'), ('Glucophage'), ('Glucophage XR'), ('Glumetza'), ('Hydrocodone'), 
('Hydromorphone'), ('Hydroxyzine'), ('Ibuprofen'), ('Invokamet'), ('Invokamet XR'), ('Invokana'), ('Janumet'), ('Januvia'), 
('Jentadueto'), ('Kombiglyze XR'), ('Komboglyze'), ('Lescol'), ('Levocetirizine'), ('Levothroid'), ('Levothyrox'), 
('Levothyroxine'), ('Levothyroxine'), ('Levoxyl'), ('Lipitor'), ('Livalo'), ('Loratadine'), ('Lorazepam'), ('Lovastatin'), 
('Metformin'), ('Methadone'), ('Methocarbamol'), ('Morphine'), ('Motrin'), ('Naproxen'), ('Onglyza'), ('Oxazepam'), ('Oxycodone'), 
('Oxymorphone'), ('Pitavastatin'), ('Pravastatin'), ('Premetherin'), ('Promethazine'), ('Riomet'), ('Rosuvastatin'), 
('Simvastatin'), ('Synthroid'), ('Temazepam'), ('Tirosint'), ('Tizanidine'), ('Tramadol'), ('Tylenol'), ('Unithroid'), ('Vytorin'), 
('Zocor');


CREATE USER 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'user'@'%';