CREATE TABLE [dbo].[users_tags] (
    [id]                NVARCHAR (255)     CONSTRAINT [DF_users_tags_id] DEFAULT (CONVERT([nvarchar](255),newid(),(0))) NOT NULL,
    [createdAt]         DATETIMEOFFSET (7) CONSTRAINT [DF_users_tags_createdAt] DEFAULT (CONVERT([datetimeoffset](7),sysutcdatetime(),(0))) NOT NULL,
    [updatedAt]         DATETIMEOFFSET (7) NULL,
    [version]           ROWVERSION         NOT NULL,
    [deleted]           BIT                DEFAULT ((0)) NULL,
    [usersId]           NVARCHAR (255)     NULL,
    [tagsId]         		NVARCHAR (255)     NULL,
    PRIMARY KEY NONCLUSTERED ([id] ASC), 
	CONSTRAINT [AK_users_tags] UNIQUE ([usersId], [tagsId]),
    CONSTRAINT [FK_users_tags_users] FOREIGN KEY ([usersId]) REFERENCES [users]([id]),  
	CONSTRAINT [FK_users_tags_tags] FOREIGN KEY ([tagsId]) REFERENCES [tags]([id])  
);




GO
CREATE CLUSTERED INDEX [createdAt]
    ON [dbo].[users_tags]([createdAt] ASC);


GO
CREATE TRIGGER [TR_users_tags_InsertUpdateDelete] ON [dbo].[users_tags]
		   AFTER INSERT, UPDATE, DELETE
		AS
		BEGIN
			SET NOCOUNT ON;
			IF TRIGGER_NESTLEVEL() > 3 RETURN;

			UPDATE [dbo].[users_tags] SET [dbo].[users_tags].[updatedAt] = CONVERT (DATETIMEOFFSET(7), SYSUTCDATETIME())
			FROM INSERTED
			WHERE INSERTED.id = [dbo].[users_tags].[id]
		END