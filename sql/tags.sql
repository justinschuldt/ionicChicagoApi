CREATE TABLE [dbo].[tags] (
    [id]                NVARCHAR (255)     CONSTRAINT [DF_tags_id] DEFAULT (CONVERT([nvarchar](255),newid(),(0))) NOT NULL,
    [createdAt]         DATETIMEOFFSET (7) CONSTRAINT [DF_tags_createdAt] DEFAULT (CONVERT([datetimeoffset](7),sysutcdatetime(),(0))) NOT NULL,
    [updatedAt]         DATETIMEOFFSET (7) NULL,
    [version]           ROWVERSION         NOT NULL,
    [deleted]           BIT                DEFAULT ((0)) NULL,
    [tag]             NVARCHAR (150)     NULL,
    PRIMARY KEY NONCLUSTERED ([id] ASC), 
);




GO
CREATE CLUSTERED INDEX [createdAt]
    ON [dbo].[tags]([createdAt] ASC);


GO
CREATE TRIGGER [TR_tags_InsertUpdateDelete] ON [dbo].[tags]
		   AFTER INSERT, UPDATE, DELETE
		AS
		BEGIN
			SET NOCOUNT ON;
			IF TRIGGER_NESTLEVEL() > 3 RETURN;

			UPDATE [dbo].[tags] SET [dbo].[tags].[updatedAt] = CONVERT (DATETIMEOFFSET(7), SYSUTCDATETIME())
			FROM INSERTED
			WHERE INSERTED.id = [dbo].[tags].[id]
		END